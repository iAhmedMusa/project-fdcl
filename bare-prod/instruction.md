# FDCL — Bare Production Deployment Guide

This folder contains everything needed to deploy FDCL to a **plain Ubuntu 24.04 VPS** (no Coolify, no managed platform) using Docker Compose + Traefik for TLS.

- `docker-compose.bare-prod.yml` — VPS production stack (Let's Encrypt auto-SSL)
- `docker-compose.bare-prod.local.yml` — local "prod-like" test stack (mkcert TLS)
- `.env.bare-prod.example` — environment variable template

**Architecture:**
```
Browser ──► Traefik (:80/:443, TLS) ──► nginx (:8080, FastCGI proxy + static) ──► php-fpm ──► MySQL
```

Traefik terminates TLS and routes by `Host()`. Nginx serves Laravel's `public/` and proxies PHP requests to php-fpm over FastCGI. Keeping both lets us add a **staging** app on the same VPS later by simply attaching another compose stack to the shared `traefik_proxy` network — no nginx config changes.

---

## Table of contents

- [Part A — Local prod-like test (mkcert + ahmedmusa.local)](#part-a--local-prod-like-test)
- [Part B — Ubuntu 24 VPS deploy](#part-b--ubuntu-24-vps-deploy)
- [Part C — Adding a staging app on the same VPS](#part-c--adding-a-staging-app-on-the-same-vps)
- [Operations cheat sheet](#operations-cheat-sheet)
- [Troubleshooting](#troubleshooting)

---

## Part A — Local prod-like test

Goal: run the *exact* production build on your Mac, over HTTPS, at `https://ahmedmusa.local`. This verifies the prod container image works before you ship to the VPS.

### A1. Install prerequisites (one-time)

```bash
brew install mkcert nss      # nss only needed if you use Firefox
mkcert -install              # installs the local CA into system + browser trust stores
```

### A2. Point `ahmedmusa.local` at localhost

Edit `/etc/hosts`:

```bash
sudo nano /etc/hosts
```

Add this line:

```
127.0.0.1   ahmedmusa.local
```

### A3. Generate local certs with mkcert

From the repo root:

```bash
cd bare-prod/traefik/certs
mkcert ahmedmusa.local
ls
# → ahmedmusa.local.pem  ahmedmusa.local-key.pem
cd ../../..
```

Traefik's `dynamic.local.yml` already references those exact filenames.

### A4. Create env file

```bash
cd bare-prod
cp .env.bare-prod.example .env.bare-prod.local
```

Edit `.env.bare-prod.local` and set:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ahmedmusa.local
APP_DOMAIN=ahmedmusa.local

DB_DATABASE=focus_lab
DB_USERNAME=focuslab
DB_PASSWORD=localpass
DB_ROOT_PASSWORD=localrootpass

GOOGLE_REDIRECT_URI=https://ahmedmusa.local/auth/google/callback
```

Leave `ACME_EMAIL` as-is (not used locally). You can also leave SMTP blank for this test.

### A5. Create the `src/.env.production` placeholder

The production Dockerfile has `COPY src/.env.production /var/www/html/.env`. Real env values come from `env_file` at runtime (overriding whatever was baked in), but the file must exist at build time or `docker build` fails.

Create a minimal one at the repo root:

```bash
cd ..   # back to repo root
cat > src/.env.production <<'EOF'
APP_ENV=production
APP_DEBUG=false
EOF
```

> `src/.env.production` is **not** tracked in git (no secrets in it anyway). If you ever blow it away, just recreate.

### A6. Generate APP_KEY

```bash
cd bare-prod
docker compose -f docker-compose.bare-prod.local.yml --env-file .env.bare-prod.local run --rm app php artisan key:generate --show
```

Copy the printed `base64:...` string into `.env.bare-prod.local` as `APP_KEY=base64:...`.

### A7. Build and start

```bash
docker compose -f docker-compose.bare-prod.local.yml --env-file .env.bare-prod.local up -d --build
```

First build will take a few minutes (PHP extensions + npm build).

### A8. Watch bootstrap

```bash
docker compose -f docker-compose.bare-prod.local.yml logs -f app
```

Wait for `Bootstrap complete. Starting PHP-FPM...`. The entrypoint waits for MySQL, runs migrations, creates the storage symlink, and caches config/routes/views.

### A9. Open the app

Browser: **https://ahmedmusa.local**

You should see the padlock (trusted because mkcert installed its CA). The Traefik dashboard is at **http://localhost:8081**.

### A10. Tear down

```bash
docker compose -f docker-compose.bare-prod.local.yml down          # stop, keep data
docker compose -f docker-compose.bare-prod.local.yml down -v       # stop and WIPE the db volume
```

---

## Part B — Ubuntu 24 VPS deploy

Fresh Ubuntu 24.04 LTS server, root SSH access (replace with a non-root sudo user ASAP).

### B1. Point DNS at the VPS

At your DNS provider, create an **A record** for `focusdigitalcolorlab.com` (and optionally `www`) pointing to the VPS public IPv4. Let's Encrypt's HTTP-01 challenge requires DNS to resolve **before** you request a cert, so do this first and wait for propagation.

Verify from anywhere:

```bash
dig +short focusdigitalcolorlab.com
```

### B2. Initial server hardening (as root, then switch)

```bash
# Log in as root
ssh root@YOUR_VPS_IP

# Create a deploy user
adduser --gecos "" deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Disable root SSH & password login
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh

# Exit and log back in as deploy
exit
ssh deploy@YOUR_VPS_IP
```

### B3. System updates & firewall

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw git curl ca-certificates

# Firewall: allow SSH + HTTP + HTTPS only
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### B4. Install Docker Engine + Compose plugin

```bash
# Remove any old docker packages
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official repo
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Let deploy run docker without sudo (log out + back in after this)
sudo usermod -aG docker $USER
exit
ssh deploy@YOUR_VPS_IP

docker --version
docker compose version
```

### B5. Clone the repo

```bash
sudo mkdir -p /opt/fdcl
sudo chown deploy:deploy /opt/fdcl
cd /opt/fdcl
git clone git@github.com:iAhmedMusa/project-fdcl.git .    # or https URL
# If using SSH, add this host's pubkey (~/.ssh/id_ed25519.pub) to GitHub deploy keys first.
```

### B6. Create env files

```bash
cd /opt/fdcl/bare-prod
cp .env.bare-prod.example .env.bare-prod
nano .env.bare-prod
```

Fill in, at minimum:
- `APP_DOMAIN=focusdigitalcolorlab.com`
- `APP_URL=https://focusdigitalcolorlab.com`
- `ACME_EMAIL=your-real-email@example.com`  *(Let's Encrypt sends expiry warnings here)*
- `DB_PASSWORD`, `DB_ROOT_PASSWORD`  *(strong, random — use `openssl rand -base64 24`)*
- `MAIL_*`  *(SMTP credentials)*
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- Leave `APP_KEY=` blank for now — generated in B8.

Lock the file down:
```bash
chmod 600 .env.bare-prod
```

### B7. Create the `src/.env.production` placeholder

Same rationale as local (build-time requirement):

```bash
cd /opt/fdcl
cat > src/.env.production <<'EOF'
APP_ENV=production
APP_DEBUG=false
EOF
```

### B8. Generate APP_KEY

```bash
cd /opt/fdcl/bare-prod
docker compose -f docker-compose.bare-prod.yml --env-file .env.bare-prod run --rm app php artisan key:generate --show
```

Copy the `base64:...` output into `.env.bare-prod` as `APP_KEY=base64:...`.

### B9. First deploy

```bash
docker compose -f docker-compose.bare-prod.yml --env-file .env.bare-prod up -d --build
```

Watch bootstrap:

```bash
docker compose -f docker-compose.bare-prod.yml logs -f app
```

Wait for `Bootstrap complete.` — entrypoint has run migrations and cached config/routes/views.

### B10. Verify TLS

Traefik auto-requests a Let's Encrypt cert on first HTTPS request. Hit the domain:

```bash
curl -I https://focusdigitalcolorlab.com
```

In a browser: **https://focusdigitalcolorlab.com** — green padlock.

Check Traefik logs if it stalls:

```bash
docker compose -f docker-compose.bare-prod.yml logs traefik | grep -i acme
```

### B11. Seed initial data (optional, first deploy only)

```bash
docker compose -f docker-compose.bare-prod.yml exec app php artisan db:seed --force
```

### B12. Enable unattended security updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Part C — Adding a staging app on the same VPS

The bare-prod stack declares `traefik_proxy` as a named network (`name: traefik_proxy`). A second stack can join it as **external**, so Traefik routes `staging.focusdigitalcolorlab.com` to the staging app without touching production.

**Outline for when you're ready:**

1. Clone a second checkout to `/opt/fdcl-staging/`.
2. Copy this `bare-prod/` folder as a starting point, then in the staging compose:
   - Remove the `traefik` service entirely (production's Traefik handles both).
   - Change container names (`fdcl_app` → `fdcl_staging_app`, etc.).
   - Change volume names (`fdcl_mysql_data` → `fdcl_staging_mysql_data`, etc.).
   - Change the Host() label to `staging.focusdigitalcolorlab.com`.
   - Declare `traefik_proxy` as external:
     ```yaml
     networks:
       traefik_proxy:
         external: true
         name: traefik_proxy
       fdcl_staging_internal:
         name: fdcl_staging_internal
     ```
3. Add a DNS A record for `staging.focusdigitalcolorlab.com` → same VPS IP.
4. `docker compose -f docker-compose.bare-staging.yml --env-file .env.bare-staging up -d --build`

Traefik auto-discovers the new labels and issues a second Let's Encrypt cert. Zero config changes on prod.

---

## Operations cheat sheet

All commands run from `/opt/fdcl/bare-prod` on the VPS. Alias for brevity:

```bash
alias dcp='docker compose -f docker-compose.bare-prod.yml --env-file .env.bare-prod'
```

| Task | Command |
|---|---|
| Status of all services | `dcp ps` |
| Tail app logs | `dcp logs -f app` |
| Tail Traefik logs (ACME, routing) | `dcp logs -f traefik` |
| Shell into app | `dcp exec app bash` |
| Run artisan | `dcp exec app php artisan <cmd>` |
| Run migrations manually | `dcp exec app php artisan migrate --force` |
| Clear & rebuild caches | `dcp exec app php artisan optimize:clear && dcp exec app php artisan optimize` |
| Restart a single service | `dcp restart nginx` |
| MySQL shell | `dcp exec db mysql -u root -p"$DB_ROOT_PASSWORD" focus_lab` |

### Deploying updates

```bash
cd /opt/fdcl
git pull
cd bare-prod
dcp build app nginx          # rebuild images with new code
dcp up -d                    # recreate changed containers
dcp logs -f app              # watch migration/cache output
```

### Database backup

```bash
dcp exec -T db mysqldump -u root -p"$DB_ROOT_PASSWORD" focus_lab \
  | gzip > /opt/fdcl/backups/fdcl-$(date +%F-%H%M).sql.gz
```

Drop that into a `cron` job (`crontab -e`) for nightly backups, and push off-site (rclone to S3/B2/rsync to another host).

### Rollback

```bash
cd /opt/fdcl
git log --oneline -20                    # find last good commit
git checkout <commit-sha>
cd bare-prod
dcp build app nginx && dcp up -d
```

If the migration itself was the problem, restore the DB dump first:

```bash
gunzip -c backups/fdcl-YYYY-MM-DD.sql.gz | dcp exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" focus_lab
```

---

## Troubleshooting

**Traefik returns `404 page not found`**
The nginx container isn't on `traefik_proxy`, or labels didn't match. Check:
```bash
dcp exec traefik wget -qO- http://api/rawdata | head -80
```

**Let's Encrypt fails, cert stays self-signed / default**
- DNS must resolve to the VPS before first request. Re-check with `dig`.
- Port 80 must be open to the world (ufw + any cloud firewall).
- Traefik logs: `dcp logs traefik | grep -i acme`.
- Hit rate limits? Wait an hour, or set `--certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory` in the Traefik command temporarily for testing.

**`docker build` fails at `COPY src/.env.production`**
The placeholder file doesn't exist. Recreate it per step B7.

**App shows 500 / blank page**
```bash
dcp exec app tail -n 100 storage/logs/laravel.log
```
Most common: `APP_KEY` missing/invalid, or DB creds mismatch between `.env.bare-prod` and what's baked into `config:cache`. Re-run:
```bash
dcp exec app php artisan config:clear
dcp exec app php artisan config:cache
```

**Migration didn't run on deploy**
The entrypoint only migrates on container *start*. After rebuild, either wait for the new `app` container to boot (entrypoint re-runs `migrate --force`) or do it manually:
```bash
dcp exec app php artisan migrate --force
```

**Changed `.env.bare-prod` but app still uses old values**
`env_file` values are injected at container start, and Laravel caches them via `config:cache` during entrypoint. Restart app:
```bash
dcp restart app
```

**Local mkcert cert shows "Not secure"**
- Run `mkcert -install` again (trust store may have been reset).
- Regenerate cert with hostname exactly matching `APP_DOMAIN` (`ahmedmusa.local`).
- Check Traefik mounted them: `docker exec fdcl_traefik ls /certs`.
