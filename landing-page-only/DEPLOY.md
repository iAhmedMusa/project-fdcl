# Deploy to Cloudflare — Zero to Live (100% Free)

Deploy the standalone landing site to Cloudflare Pages on your own domain.
Your domain is **already registered with Cloudflare**, so DNS + SSL are automatic and free.

Total cost: **$0**. No credit card required for anything below.

---

## What you get (free tier)

| Feature | Free allowance |
|---|---|
| Bandwidth / requests | Unlimited on Pages |
| Builds | 500 / month (each `git push` = 1 build, ~1–2 min) |
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

## Path A — Git-connected Pages (recommended, auto-deploys on push)

### Step 1: Create the Pages project

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**.
2. Authorize GitHub if asked, select this repository.
3. When asked for the branch, choose **`landing-page-only`**.

### Step 2: Configure the build (copy exactly)

| Setting | Value |
|---|---|
| Project name | `fdcl-landing` (or anything) |
| Production branch | `landing-page-only` |
| Framework preset | **None** (or Next.js Static HTML Export — then override the build command below) |
| Root directory | `landing-page-only` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variables | `NODE_VERSION = 20` |

> ⚠️ Do NOT use the default Next.js preset command (`npx @cloudflare/next-on-pages`).
> This site is a pure static export — plain `npm run build` is all it needs.

### Step 3: Deploy

1. Click **Save and Deploy**. First build takes ~2–3 minutes (npm install + build).
2. You get a live URL like `https://fdcl-landing.pages.dev`. Open it and check:
   - Hero, gallery images, and Bangla fonts load.
   - EN/বাংলা toggle works.
   - Every CTA opens `https://wa.me/8801973140768`.

### Step 4: Attach your custom domain

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter your domain:
   - Apex (`yourdomain.com`) — Cloudflare adds a CNAME with flattening automatically.
   - Or `www.yourdomain.com` — then add a redirect www → apex (or vice versa) under **Rules**.
3. Click **Activate**. Because the domain is already on Cloudflare, DNS is added for you — no manual records.
4. SSL certificate is issued automatically (usually < 5 minutes). Status shows under **Custom domains** → **Active**.

### Step 5: Verify

- `https://yourdomain.com` loads with a valid 🔒 certificate.
- Under the domain's **SSL/TLS** tab, encryption mode should be **Full (strict)** (Pages serves valid certs, so strict works).
- Test on mobile data (not Wi-Fi) to confirm public DNS.

---

## Path B — Manual upload via Wrangler (no GitHub connection)

Useful if you just want to ship the already-built `out/` folder once.

```bash
cd landing-page-only
npm run build
npx wrangler login          # opens browser, one-time
npx wrangler pages deploy out --project-name fdcl-landing
```

Then attach the custom domain exactly as in **Path A, Step 4** (Dashboard → Pages project → Custom domains).

To update later, repeat `npm run build` + `wrangler pages deploy out`.

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

Pages project → **Deployments** → pick any previous deployment → **⋯ → Rollback to this deployment**. Instant, free.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails with `ERESOLVE` / peer-dep error | You used the default Next.js preset. Set build command to exactly `npm run build` and redeploy. |
| Build fails on Node version | Set env var `NODE_VERSION = 20` in Pages → Settings → Environment variables, then Retry. |
| `pages.dev` URL works, custom domain shows SSL error | Wait up to ~15 min for certificate issuance; check Custom domains tab shows Active. |
| Old content stuck after deploy | Pages → Caching → **Purge cache**, or hard-refresh (Ctrl/Cmd+Shift+R). JS/CSS filenames are hashed, so this is rare. |
| Fonts with spaces in filenames 404 | They are served URL-encoded from `/fonts/` — works as-is. If you ever rename them, update `app/globals.css` `@font-face` paths too. |
| 404 on sub-paths | Not applicable — this site is a single `/` page with anchor sections (`#services`, `#gallery`, …). |

---

## Checklist (copy/paste)

- [ ] `landing-page-only` branch pushed to GitHub
- [ ] Pages project created, root `landing-page-only`, build `npm run build`, output `out`, `NODE_VERSION=20`
- [ ] `*.pages.dev` URL verified (content, images, fonts, WhatsApp links)
- [ ] Custom domain added and **Active**
- [ ] `https://yourdomain.com` loads with valid certificate, SSL mode Full (strict)
