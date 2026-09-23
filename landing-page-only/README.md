# FDCL Landing Page — standalone Next.js site (Cloudflare Pages)

Home-only static export of the Focus Digital Color Lab landing page.
No Laravel, no backend — all order CTAs point to WhatsApp.

## Develop

```bash
cd landing-page-only
npm install
npm run dev      # http://localhost:3000
```

## Build (static export)

```bash
npm run build    # outputs to ./out
```

## Deploy to Cloudflare Pages (free)

Option A — Dashboard:
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets
2. Upload the `out/` directory, or connect the repo:
   - Root directory: `landing-page-only`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: 20

Option B — Wrangler CLI:

```bash
cd landing-page-only
npm run build
npx wrangler pages deploy out --project-name fdcl-landing
```

No adapter needed — this is a pure static export (`output: 'export'`,
`images.unoptimized`), so it runs on Cloudflare Pages free tier with
zero functions.

## Structure

```
landing-page-only/
  app/               # layout.jsx (SEO/meta) + page.jsx (Home)
  components/        # LandingLayout + landing/* sections + FadeIn/ThemeToggle
  contexts/          # LanguageContext (en/bn) + ThemeContext (dark mode)
  translations/      # en.js, bn.js
  lib/constants.js   # WHATSAPP_URL — single place to change the CTA number
  public/images/studio/  # all 32 studio photos
  public/fonts/      # Bangla fonts
```

## Changing the WhatsApp number

Edit `lib/constants.js` — every CTA (nav, hero, services, about,
contact, footer) reads from there.
