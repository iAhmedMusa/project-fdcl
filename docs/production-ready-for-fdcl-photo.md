# Production Readiness: B2 Cloud Storage (`fdcl-photo`)

## Prerequisites Completed

- [x] `league/flysystem-aws-s3-v3` installed via Composer
- [x] Laravel `s3` disk configured in `config/filesystems.php`
- [x] Bucket: `fdcl-photo` — Backblaze B2, region `eu-central-003`

---

## Step 1 — Create B2 Bucket & Application Key

1. Log in to [Backblaze B2 Console](https://secure.backblaze.com/b2_buckets.htm)
2. Create bucket `fdcl-photo`:
   - **Bucket type:** Private
   - **Region:** EU Central (eu-central-003)
3. Go to **App Keys** → **Add a New Application Key**:
   - Name: `fdcl-app`
   - Bucket: restrict to `fdcl-photo`
   - Permissions: Read & Write
4. Copy `keyID` and `applicationKey` immediately — applicationKey shown only once

---

## Step 2 — Coolify Environment Variables

In Coolify, set these environment variables for the `fdcl` service:

```env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=<keyID from B2>
AWS_SECRET_ACCESS_KEY=<applicationKey from B2>
AWS_DEFAULT_REGION=eu-central-003
AWS_BUCKET=fdcl-photo
AWS_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

> Do NOT set `AWS_URL` unless you configure a CDN subdomain (see Step 5).

---

## Step 3 — Migrate Existing Files from Local Storage

Run once before switching traffic. From inside the app container:

```bash
# Install rclone (if not present on host)
# Or use the aws CLI — both work with B2's S3-compatible API

# Option A: aws CLI (already available if aws-sdk installed)
docker exec fdcl_app php artisan tinker --execute="
\$files = \Illuminate\Support\Facades\Storage::disk('public')->allFiles();
foreach (\$files as \$file) {
    \$contents = \Illuminate\Support\Facades\Storage::disk('public')->get(\$file);
    \Illuminate\Support\Facades\Storage::disk('s3')->put(\$file, \$contents, 'public');
    echo \"Migrated: \$file\n\";
}
"

# Option B: rclone (faster for large volumes)
# Configure rclone with B2 credentials then:
# rclone sync /var/www/html/storage/app/public b2:fdcl-photo --progress
```

Verify files appear in B2 console before switching `FILESYSTEM_DISK`.

---

## Step 4 — Deploy to Production

1. Push env vars to Coolify (Step 2)
2. Trigger redeploy — no code changes needed
3. Confirm uploads land in B2: test a file upload, check B2 console

---

## Step 5 (Optional) — Cloudflare CDN in Front of B2

Free egress via Cloudflare ↔ B2 partnership.

1. Add CNAME record in Cloudflare DNS:
   ```
   cdn.focusdigitalcolorlab.com  →  s3.eu-central-003.backblazeb2.com
   ```
2. Enable Cloudflare proxy (orange cloud)
3. Add to Coolify env:
   ```env
   AWS_URL=https://cdn.focusdigitalcolorlab.com
   ```
4. `Storage::url('file.jpg')` will now return `https://cdn.focusdigitalcolorlab.com/file.jpg`

---

## Step 6 — Remove Local Storage Volume (Post-Migration)

Once B2 is confirmed working and all files migrated, clean up `docker-compose.prod.yml`:

```yaml
# REMOVE these volume mounts from app and nginx services:
# - fdcl_storage:/var/www/html/storage/app/public

# REMOVE the volume declaration:
# volumes:
#   fdcl_storage:
```

Also remove the nginx `/storage` location block from `prod.conf` — files are now served from B2/CDN directly.

---

## Checklist

- [ ] B2 bucket `fdcl-photo` created (EU Central, private)
- [ ] Application key generated with read/write on `fdcl-photo`
- [ ] Real credentials set in Coolify (replace dummy values)
- [ ] Existing files migrated to B2
- [ ] Production deploy triggered and verified
- [ ] Test upload in prod — confirm file appears in B2 console
- [ ] `fdcl_storage` volume removed from prod compose
- [ ] nginx `/storage` location block removed from `prod.conf`
- [ ] (Optional) Cloudflare CDN subdomain configured

---

## Rollback

To revert to local storage instantly:

```env
FILESYSTEM_DISK=local
```

Redeploy. No data loss — B2 files remain; new uploads go local until switched back.
