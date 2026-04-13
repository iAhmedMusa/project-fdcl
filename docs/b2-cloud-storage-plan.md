# B2 Cloud Storage Integration Plan

## Overview

Migrate file storage from local Docker volume (`fdcl_storage`) to Backblaze B2 — an S3-compatible object storage service. This makes uploaded files durable across deployments, removes the need for the shared nginx/app storage volume, and enables CDN delivery.

## Why B2

- S3-compatible API — works with Laravel's existing `s3` filesystem driver
- Significantly cheaper than AWS S3 (free egress to Cloudflare CDN)
- No changes to application upload logic — only config changes

---

## Implementation Steps

### 1. Create B2 Bucket

- Log in to Backblaze B2 console
- Create a new **private** bucket (e.g. `fdcl-storage`)
- Generate an **Application Key** with read/write access scoped to that bucket
- Note: `keyId`, `applicationKey`, `endpoint` (e.g. `s3.us-east-005.backblazeb2.com`), `region` (e.g. `us-east-005`)

### 2. Install the S3 Filesystem Driver

Laravel's `s3` driver is built-in but requires the AWS SDK:

```bash
composer require league/flysystem-aws-s3-v3
```

### 3. Configure `config/filesystems.php`

The default `s3` disk works with B2 via the S3-compatible API. No code changes needed — only environment variables:

```php
// config/filesystems.php
'default' => env('FILESYSTEM_DISK', 'local'),
```

Change `FILESYSTEM_DISK=s3` in production env.

### 4. Environment Variables (Coolify)

Add these to Coolify's environment variable settings:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<B2 keyId>
AWS_SECRET_ACCESS_KEY=<B2 applicationKey>
AWS_DEFAULT_REGION=<B2 region>          # e.g. us-east-005
AWS_BUCKET=fdcl-storage
AWS_ENDPOINT=https://s3.<region>.backblazeb2.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

### 5. Update `docker-compose.prod.yml`

Once B2 is active, the shared `fdcl_storage` volume is no longer needed for uploads. Remove the volume mounts from `app` and `nginx` services and the `fdcl_storage` volume declaration.

The `nginx` `/storage` location block in `prod.conf` can also be removed — files will be served directly from B2 (or via CDN URL).

### 6. Update `storage:link` behaviour

`php artisan storage:link` is still safe to run (it links `public/storage` to `storage/app/public`) but uploaded files will go to B2 instead of local disk. The symlink is harmless.

### 7. Optional: Cloudflare CDN in front of B2

- Point a subdomain (e.g. `cdn.focusdigitalcolorlab.com`) to the B2 bucket endpoint via Cloudflare
- Set `AWS_URL=https://cdn.focusdigitalcolorlab.com` so `Storage::url()` returns CDN URLs
- Enables free egress bandwidth via Cloudflare's B2 partnership

---

## File URL Behaviour

| Driver | `Storage::url('file.jpg')` returns |
|--------|-------------------------------------|
| `local` | `/storage/file.jpg` (served by nginx via volume) |
| `s3` (B2) | `https://s3.<region>.backblazeb2.com/<bucket>/file.jpg` |
| `s3` + `AWS_URL` | `https://cdn.focusdigitalcolorlab.com/file.jpg` |

Ensure all image URLs in the codebase use `Storage::url()` rather than hardcoded `/storage/` paths — they already should if using Laravel conventions.

---

## Migration of Existing Files

When switching from local to B2 in production:

```bash
# One-time: upload existing storage contents to B2
# Run from inside the app container
php artisan tinker
# or use aws CLI / rclone to sync storage/app/public/ → B2 bucket
```

Use `rclone` or the B2 CLI to sync the existing `storage/app/public/` volume contents to the B2 bucket before switching the `FILESYSTEM_DISK` env var.

---

## Current Status

- [ ] B2 bucket created
- [ ] Application key generated
- [ ] `league/flysystem-aws-s3-v3` installed
- [ ] Env vars added to Coolify
- [ ] Existing files migrated to B2
- [ ] `fdcl_storage` volume removed from `docker-compose.prod.yml`
- [ ] nginx `/storage` location block removed from `prod.conf`
- [ ] Optional: Cloudflare CDN configured
