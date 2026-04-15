# Storage Switch Reference

## The One Rule

Change `FILESYSTEM_DISK` in `.env`. Nothing else.

```env
# Local development
FILESYSTEM_DISK=public

# Cloud (B2, R2, or S3)
FILESYSTEM_DISK=s3
```

---

## What each disk does

| `FILESYSTEM_DISK` | Files stored at | URLs look like |
|---|---|---|
| `public` | `storage/app/public/` | `/storage/orders/ORD-xxx/photo.jpg` |
| `s3` | B2 bucket `fdcl-photos` | `https://s3.eu-central-003.backblazeb2.com/fdcl-photos/orders/ORD-xxx/photo.jpg` |

---

## Why it just works

Every upload in the codebase uses:
```php
$file->storeAs($directory, $filename, config('filesystems.default'));
```

Every URL in the codebase uses:
```php
Storage::url($path)          // plain public URL
```

Both read from `FILESYSTEM_DISK` — no hardcoded disk names anywhere.

---

## Cloud env vars (Coolify / production)

```env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=<B2 keyId>
AWS_SECRET_ACCESS_KEY=<B2 applicationKey>
AWS_DEFAULT_REGION=eu-central-003
AWS_BUCKET=fdcl-photos
AWS_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

Bucket `fdcl-photos` is **public** — `Storage::url()` returns a direct accessible URL, no signed URLs needed.

---

## Switching providers (B2 → R2 → S3)

All use the same `s3` driver. Only the env vars change:

| Provider | `AWS_ENDPOINT` | `AWS_DEFAULT_REGION` |
|---|---|---|
| Backblaze B2 | `https://s3.eu-central-003.backblazeb2.com` | `eu-central-003` |
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` | `auto` |
| AWS S3 | *(omit — use default)* | e.g. `ap-southeast-1` |

No code changes. Swap credentials and endpoint only.

---

## Local dev checklist

- `FILESYSTEM_DISK=public` in `src/.env`
- Run `php artisan storage:link` once (links `public/storage` → `storage/app/public`)
- Uploads appear in `src/storage/app/public/`
