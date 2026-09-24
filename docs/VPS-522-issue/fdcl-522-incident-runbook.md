# FDCL-VPS — Recurring 522 After `apt upgrade` / Reboot

**Incident date:** 2026-07-12
**Host:** FDCL-VPS (Hetzner) · Ubuntu 24.04 · Coolify 4.1.2 · Traefik v3.6
**Symptom:** `focusdigitalcolorlab.com` returns **Cloudflare Error 522 — Connection timed out**
**Status:** Resolved. Permanent self-healing fix deployed.

---

## 1. Root Cause

`ufw-docker` FORWARD rules are pinned to the **container's IP address**, not its name.

```
ufw rule said:   ALLOW FWD → 10.0.1.6:443     (stale)
Traefik was at:  10.0.1.3:443                 (actual)
```

**The chain of events, every time:**

1. `apt upgrade` includes `docker-ce` (or the VPS reboots)
2. Docker daemon restarts → all containers restart
3. Containers get **new IPs** from the `10.0.0.0/8` pool
4. `coolify-proxy` (Traefik) moves, e.g. `10.0.1.6` → `10.0.1.3`
5. The `ufw-docker` allow rule still points at the **old IP**
6. Cloudflare's SYN arrives → Docker DNATs it to the new IP → no matching ufw FORWARD rule → **silently dropped** by `ufw-docker-logging-deny`
7. Traefik never receives the SYN → never sends SYN-ACK → Cloudflare times out → **522**

**This is causal, not coincidental.** Any Docker daemon restart reproduces it.

---

## 2. Why It Was Hard To Diagnose

Every surface-level check passes, because nothing is actually broken:

| Check | Result | Misleading because |
|---|---|---|
| `docker ps` | All healthy | Containers genuinely are fine |
| `curl` from VPS | 200 OK | Loopback bypasses the FORWARD chain entirely |
| Certificate expiry | Valid to Sep 30 | Cert was never the issue |
| DNS / Cloudflare origin IP | Correct | `46.225.92.108` matched throughout |
| `ufw status` | `80/443 ALLOW Anywhere` | Those are INPUT rules; Docker traffic uses **FORWARD** |
| Hetzner cloud firewall | Packets arriving | Confirmed via tcpdump |

The failure is one stale IP inside a forwarding rule. Invisible without packet counters.

---

## 3. The Diagnostic That Actually Found It

**Step 1 — prove packets reach the box:**
```bash
sudo timeout 30 tcpdump -ni any 'tcp port 443 and not net 100.64.0.0/10'
```
Load the site from mobile data while this runs.

Observed: repeated `Flags [S]` (SYN) from Cloudflare IPs (`104.22.x`, `172.70.x`) to `46.225.92.108:443`, retried ~7×, **never any SYN-ACK back**.
→ Packets arrive. Server never answers. Problem is **local**, not Hetzner/Cloudflare/DNS.

**Step 2 — find where they die (packet counters are the key):**
```bash
sudo iptables -t nat -L DOCKER -n -v --line-numbers      # DNAT target IP
sudo iptables -L DOCKER-USER -n -v --line-numbers        # where they get dropped
sudo ufw status | grep coolify-proxy                     # what IP the rule allows
```

The tell:
- `nat DOCKER`: `DNAT tcp dpt:443 → 10.0.1.3:443` — **344 pkts** (DNAT working)
- `filter DOCKER` accept rule for `10.0.1.3:443` — **0 pkts** (never reached)
- `DOCKER-USER` → `ufw-docker-logging-deny` — **104 pkts** ← *packets dying here*
- `ufw status` → rule allows **10.0.1.6** ← *stale IP, mismatch confirmed*

---

## 4. Immediate Fix (if it happens again)

```bash
sudo ufw-docker delete allow coolify-proxy
sudo ufw-docker allow coolify-proxy 80/tcp
sudo ufw-docker allow coolify-proxy 443/tcp
sudo ufw reload
```

Verify the rule now matches the **live** container IP:
```bash
docker inspect coolify-proxy --format '{{.NetworkSettings.Networks.coolify.IPAddress}}'
sudo ufw status | grep coolify-proxy
```
Both must show the same IP. Then reload the site.

---

## 5. Permanent Fix (deployed 2026-07-12)

Self-healing systemd service + timer. Checks whether the ufw rule matches the live container IP; corrects it only if it doesn't (exits in ~50ms otherwise).

**`/usr/local/bin/fix-ufw-docker.sh`**
```bash
#!/bin/bash
CUR=$(docker inspect coolify-proxy --format '{{.NetworkSettings.Networks.coolify.IPAddress}}' 2>/dev/null)
[ -z "$CUR" ] && exit 0
ufw status | grep -q "$CUR 443/tcp" && exit 0
ufw-docker delete allow coolify-proxy
ufw-docker allow coolify-proxy 80/tcp
ufw-docker allow coolify-proxy 443/tcp
ufw reload
logger "fix-ufw-docker: resynced to $CUR"
```

**`/etc/systemd/system/fix-ufw-docker.service`** — fires on Docker start (covers `apt upgrade` + reboot)
**`/etc/systemd/system/fix-ufw-docker.timer`** — runs every 5 min (covers app redeploys, which change container IPs *without* restarting the Docker daemon)

Both are needed: the service alone misses Coolify app redeploys; the timer alone leaves a gap of up to 5 min after a reboot.

**Health check:**
```bash
sudo systemctl list-timers | grep ufw          # timer active?
journalctl -t fix-ufw-docker --since '7 days ago'   # did it ever fire?
```

---

## 6. If It Happens Again — Triage Order

Work top to bottom. **Do not skip to step 4** — the earlier steps are what distinguish this bug from a genuine outage.

1. **Confirm the error is 522** (not 521/525/526, not a browser DNS error)
   → 522 = packets reach origin but get no answer. Different codes mean different causes.

2. **Confirm containers are healthy**
   ```bash
   docker ps
   ```
   All up + healthy → the app is fine, the problem is network path.

3. **Confirm Traefik answers locally**
   ```bash
   curl -I -H "Host: focusdigitalcolorlab.com" http://127.0.0.1:80
   ```
   307 redirect → Traefik alive. Confirms the problem is between NIC and container.

4. **Check for the stale-IP mismatch (this bug)**
   ```bash
   docker inspect coolify-proxy --format '{{.NetworkSettings.Networks.coolify.IPAddress}}'
   sudo ufw status | grep coolify-proxy
   ```
   **Different IPs = this bug.** Apply §4. Then check why the self-healing timer didn't fire:
   ```bash
   sudo systemctl status fix-ufw-docker.timer
   sudo systemctl start fix-ufw-docker.service
   ```

5. **IPs match but still 522?** → Not this bug. Continue:
   ```bash
   sudo timeout 30 tcpdump -ni any 'tcp port 443 and not net 100.64.0.0/10'
   ```
   - **No packets arriving** → Hetzner Cloud Firewall. Check inbound 80/443 rules allow the current Cloudflare IP list (`cloudflare.com/ips-v4` + `/ips-v6`). CF rotates ranges; a hardcoded allowlist goes stale.
   - **Packets arriving, no SYN-ACK** → still a local drop. Re-run the counter check from §3.

6. **Check disk and memory** (a full disk causes silent, weird failures)
   ```bash
   df -h && free -h
   ```

---

## 7. Known Limitations of the Current Fix

- The script pins only the `coolify` network (`10.0.1.x`). `coolify-proxy` is also attached to per-app networks (`10.0.2.x`, `10.0.3.x`). `ufw-docker allow` re-adds rules for all attached networks, so this is covered in practice — but if a *new* app network appears, verify with `sudo ufw status | grep coolify-proxy`.
- `/data/coolify/proxy/docker-compose.yml` is Coolify-managed (`coolify.managed=true`). **Do not hand-edit it** — Coolify regenerates it and your changes vanish silently. This is why the fix lives in systemd, not in the compose file.
- Worst-case exposure is now ≤5 minutes (one timer interval), self-recovering.

---

## 8. Long-Term Option — Cloudflare Tunnel

Eliminates this entire bug class: `cloudflared` dials **outbound** to Cloudflare, so no inbound ports and no FORWARD rules exist to go stale. Hetzner inbound 80/443 can be closed completely — strictly more secure than the current IP-allowlist approach.

**Not a drop-in replacement.** Migrating requires, in order:

1. **Switch Traefik from HTTP-01 to DNS-01 ACME** (Cloudflare API token). With no inbound port 80, HTTP-01 challenges are impossible and Let's Encrypt renewal breaks permanently. **Do this first or the site dies at cert expiry.**
2. **Resolve the redirect loop.** Coolify has `Force HTTPS: Enabled`. If `cloudflared` forwards to `http://localhost:80`, Traefik redirects to HTTPS, Cloudflare follows, loop. Fix by trusting `X-Forwarded-Proto` from cloudflared, or point the tunnel at `https://localhost:443` with `noTLSVerify: true`.
3. **Verify Laravel TrustProxies** is configured for the tunnel.
4. **Only then** close Hetzner inbound 80/443.

Plan it as a scheduled migration, never as an emergency patch.

---

## 9. Key Takeaways

- `ufw status` showing `80/443 ALLOW Anywhere` says **nothing** about Docker traffic. Docker uses the **FORWARD** chain; those are **INPUT** rules.
- `curl` from the VPS itself proves nothing about external reachability — loopback skips the entire FORWARD path.
- **Packet counters (`iptables -L -n -v`) are the ground truth.** A rule with `0 pkts` that *should* be matching is the bug.
- "Everything looks healthy" is compatible with "the site is completely down."
- The 522 error code itself was the most valuable clue in the whole investigation — it says *packets reached the origin and got no answer*, which immediately excludes DNS, certs, and Cloudflare-side problems.

---

**Version history**

| Date | Change |
|---|---|
| 2026-07-12 | Initial version. Root cause identified, self-healing service + timer deployed. |
