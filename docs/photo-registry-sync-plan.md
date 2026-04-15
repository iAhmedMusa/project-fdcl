# Plan: Sync Physical Photos → B2 → Database Registry

## Overview

Photos exist across 3 sources (portable drive, Google Drive, local directory) with meaningful names that are the customer-facing Photo IDs (e.g. `FDCL-001001.jpg`). Goal: sync all photos to B2, then register them in `photo_registry` so customers can search by Photo ID on `/order/reprint`.

---

## Conventions

| Item                  | Value                                           |
| --------------------- | ----------------------------------------------- |
| B2 bucket             | `fdcl-photos`                                   |
| Storage prefix        | `old-photo-storage/`                            |
| Filename format       | `FDCL-XXXXXX.jpg` (or `.jpeg`, `.png`)          |
| `registry_code` in DB | filename without extension → `FDCL-001001`      |
| `photo_paths` in DB   | `["old-photo-storage/FDCL-001001.jpg"]`         |
| `user_id`             | `null` (no customer assigned until first order) |

---

## Step 1 — Prepare rclone

Install rclone if not already:

```bash
brew install rclone   # macOS
```

Configure B2 remote (one-time):

```bash
rclone config
# → New remote → name: b2fdcl
# → Storage: Backblaze B2
# → account: <B2_KEY_ID from .env>
# → key: <B2_APPLICATION_KEY from .env>
```

Verify connection:

```bash
rclone ls b2fdcl:fdcl-photos
```

---

## Step 2 — Gather Photos into One Staging Folder

Create a single local staging directory before syncing:

```bash
mkdir -p ~/fdcl-staging/photos
```

### From portable drive

```bash
cp -r /Volumes/YourDrive/photos/. ~/fdcl-staging/photos/
```

### From Google Drive

Use [rclone with Google Drive remote](https://rclone.org/drive/) or download via browser, then:

```bash
cp -r ~/Downloads/google-photos/. ~/fdcl-staging/photos/
```

Or directly with rclone if Google Drive is configured as a remote (`gdrive`):

```bash
rclone copy gdrive:FDCLPhotos ~/fdcl-staging/photos/
```

### From local directory

```bash
cp -r /path/to/local/photos/. ~/fdcl-staging/photos/
```

**Result:** `~/fdcl-staging/photos/` contains all files named `FDCL-XXXXXX.jpg`.

---

## Step 3 — Sync to B2

Dry run first (no changes):

```bash
rclone sync ~/fdcl-staging/photos/ b2fdcl:fdcl-photos/old-photo-storage --dry-run
```

Actual sync with progress:

```bash
rclone sync ~/fdcl-staging/photos/ b2fdcl:fdcl-photos/old-photo-storage --progress
```

Verify files landed:

```bash
rclone lsf b2fdcl:fdcl-photos/old-photo-storage | head -20
```

---

## Step 4 — Register Photos in Database

Instead of a static seeder (breaks when new batches arrive), use a custom artisan command that:

- Lists files from B2 (or a local path)
- Skips already-registered `registry_code` entries
- Creates `PhotoRegistry` records with `user_id = null`
- Is fully re-runnable

### Command to create

```
php artisan make:command SyncPhotoRegistry
```

File: `app/Console/Commands/SyncPhotoRegistry.php`

### Logic

```php
// List all files under old-photo-storage/ prefix in B2
$files = Storage::files('old-photo-storage');

foreach ($files as $path) {
    $filename  = basename($path);                       // FDCL-001001.jpg
    $code      = strtoupper(pathinfo($filename, PATHINFO_FILENAME)); // FDCL-001001
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    // Skip non-image files
    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) continue;

    // Skip if already registered
    if (PhotoRegistry::where('registry_code', $code)->exists()) continue;

    PhotoRegistry::create([
        'registry_code' => $code,
        'user_id'       => null,
        'photo_paths'   => [$path],         // relative path: "old-photo-storage/FDCL-001001.jpg"
        'notes'         => null,
        'expires_at'    => null,            // no expiry for studio-registered photos
    ]);
}
```

### Run

```bash
# In production (via Coolify shell or SSH)
php artisan photos:sync-registry

# Locally (with FILESYSTEM_DISK=s3 pointing at B2)
php artisan photos:sync-registry
```

Output example:

```
Scanning B2 old-photo-storage/ prefix...
  [NEW]  FDCL-001001
  [NEW]  FDCL-001002
  [SKIP] FDCL-001003 (already registered)
  ...
Done. 14 created, 1 skipped.
```

---

## Step 5 — Verify

In the staff panel go to `/staff/photos` — all new Photo IDs should appear in the list.

Have a customer (or test account) go to `/order/reprint`, enter `FDCL-001001` — should find the photo and allow ordering.

---

## Adding More Photos Later

Same flow, re-runnable:

1. Add new files to `~/fdcl-staging/old-photo-storage/`
2. `rclone sync ~/fdcl-staging/photos/ b2fdcl:fdcl-photos/old-photo-storage --progress`
3. `php artisan photos:sync-registry`

Command skips already-registered codes, only creates new ones.

---

## What Gets Built (Code)

| File                                         | Action              |
| -------------------------------------------- | ------------------- |
| `app/Console/Commands/SyncPhotoRegistry.php` | New artisan command |

No routes, no UI, no migrations needed.
