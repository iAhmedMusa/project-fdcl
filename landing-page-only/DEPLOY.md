# Deploy to Cloudflare — Zero to Live (100% Free)

Deploy the standalone landing site to Cloudflare Workers (Static Assets) on your own domain.
Your domain is **already registered with Cloudflare**, so DNS + SSL are automatic and free.

Total cost: **$0**. No credit card required for anything below.

---

## What you get (free tier)

| Feature | Free allowance |
|---|---|
| Bandwidth / requests | 100k requests/day (a studio landing page will never come close) |
| Builds | Generous monthly quota (each `git push` = 1 build, ~1–2 min) |
| Custom domains + SSL | Unlimited, auto-issued |
| Preview deployments | Every branch/PR gets its own URL |

---

## Prerequisites

1. A Cloudflare account with your domain already added (done).
2. This repo pushed to GitHub **including the `landing-page-only` branch**:
   ```bash
   git checkout landing-page-only
   git push -u origin landing-page-only
   ```
3. The production branch for the site is `landing-page-only` (the main Laravel app is untouched).

---

## Path A — Git-connected Worker (recommended, auto-deploys on push)

Uses the dashboard **Create an app** flow with `wrangler.jsonc` (already in this
folder — Static Assets hosting, no Worker script needed).

### Step 1: Create the app

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create an app** → **Connect to Git** (or **Select a repository**).
2. Authorize GitHub if asked, select `iAhmedMusa/project-fdcl`.
3. When asked for the branch, choose **`landing-page-only`**.

### Step 2: Configure the build (copy exactly)

| Setting | Value |
|---|---|
| Project name | `focus-lab-website` |
| Production branch | `landing-page-only` |
| Root directory | `landing-page-only` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (default — works via `wrangler.jsonc`) |
| Preview command | `npx wrangler preview` (default) |
| Environment variables | `NODE_VERSION = 20` |

> The create screen doesn't show Root directory — set it after the first
> (failed) build under Worker → Settings → Build → Root directory =
> `landing-page-only`, then Retry deployment. The deploy command needs
> `landing-page-only/wrangler.jsonc` (already committed) — don't delete it.

### Step 3: Deploy

1. Click **Deploy**. First build takes ~2–3 minutes (npm install + build).
2. You get a live URL like `https://focus-lab-website.workers.dev`. Open it and check:
   - Hero, gallery images, and Bangla fonts load.
   - EN/বাংলা toggle works.
   - Every CTA opens `https://wa.me/8801973140768`.

### Step 4: Attach your custom domain

1. In the Worker → **Settings** → **Domains & Routes** → **Add custom domain**.
2. Enter your domain:
   - Apex (`yourdomain.com`) — Cloudflare routes it automatically.
   - Or `www.yourdomain.com` — then add a redirect www → apex (or vice versa) under **Rules**.
3. Click **Activate**. Because the domain is already on Cloudflare, DNS is added for you — no manual records.
4. SSL certificate is issued automatically (usually < 5 minutes).

### Step 5: Verify

- `https://yourdomain.com` loads with a valid 🔒 certificate.
- Under the domain's **SSL/TLS** tab, encryption mode should be **Full (strict)**.
- Test on mobile data (not Wi-Fi) to confirm public DNS.

---

## Path B — Manual deploy via Wrangler (no GitHub connection)

Useful if you just want to ship the already-built `out/` folder once.

```bash
cd landing-page-only
npm run build
npx wrangler login          # opens browser, one-time
npx wrangler deploy         # reads wrangler.jsonc, uploads ./out
```

Then attach the custom domain exactly as in **Path A, Step 4** (Worker → Settings → Domains & Routes).

To update later, repeat `npm run build` + `npx wrangler deploy`.

---

## Updating the live site (Path A)

```bash
git checkout landing-page-only
# edit files, then:
npm run build               # confirm it still builds locally
git add -A && git commit -m "describe your change" && git push
```

Cloudflare rebuilds and redeploys automatically (~1–2 min). Each push also creates a **preview URL** you can share before it goes live.

To change the WhatsApp number everywhere: edit one line in `lib/constants.js`, rebuild, push.

---

## Rollback

Worker → **Deployments** → pick any previous deployment → **Rollback to this deployment**. Instant, free.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Deploy fails: missing `wrangler.toml`/`wrangler.jsonc` | It's committed at `landing-page-only/wrangler.jsonc`. If you set a different Root directory, move it or fix the path. |
| `npx wrangler deploy` fails: "Missing entry-point" | Build ran at repo root instead of `landing-page-only/` — set Root directory under Worker → Settings → Build, then Retry. |
| Build fails on Node version | Set env var `NODE_VERSION = 20` in Worker → Settings → Environment variables, then Retry. |
| `workers.dev` URL works, custom domain shows SSL error | Wait up to ~15 min for certificate issuance; check Domains & Routes shows Active. |
| Old content stuck after deploy | Pages → Caching → **Purge cache**, or hard-refresh (Ctrl/Cmd+Shift+R). JS/CSS filenames are hashed, so this is rare. |
| Fonts with spaces in filenames 404 | They are served URL-encoded from `/fonts/` — works as-is. If you ever rename them, update `app/globals.css` `@font-face` paths too. |
| 404 on sub-paths | Not applicable — this site is a single `/` page with anchor sections (`#services`, `#gallery`, …). |

---

## Checklist (copy/paste)

- [ ] `landing-page-only` branch pushed to GitHub
- [ ] Worker created, root directory `landing-page-only`, build `npm run build`, deploy `npx wrangler deploy`, `NODE_VERSION=20`
- [ ] `*.workers.dev` URL verified (content, images, fonts, WhatsApp links)
- [ ] Custom domain added and **Active**
- [ ] `https://yourdomain.com` loads with valid certificate, SSL mode Full (strict)
