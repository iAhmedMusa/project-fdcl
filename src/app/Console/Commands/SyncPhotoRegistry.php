<?php

namespace App\Console\Commands;

use App\Models\PhotoRegistry;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SyncPhotoRegistry extends Command
{
    protected $signature = 'photos:sync-registry';

    // Scans the B2 bucket prefix 'old-photo-storage/' and registers any new photos
    // into the photo_registry table. Safe to re-run — already-registered codes are skipped.
    // Run this after every new batch upload to B2 via rclone.
    protected $description = 'Scan B2 old-photo-storage/ prefix and register any unregistered photos in photo_registry';

    public function handle(): int
    {
        $this->info('Scanning B2 old-photo-storage/ prefix...');

        // Always target the s3 disk (Backblaze B2) explicitly — regardless of FILESYSTEM_DISK env.
        // Bucket: fdcl-photos | Region: EU Central | Prefix: old-photo-storage/
        $files = Storage::disk('s3')->files('old-photo-storage');

        $created = 0;
        $skipped = 0;

        foreach ($files as $path) {
            $filename  = basename($path);
            $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

            // Ignore non-image files (e.g. .DS_Store, thumbs.db, rclone temp files)
            if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
                continue;
            }

            // registry_code is the filename without extension, uppercased — e.g. FDCL-001001
            $code = strtoupper(pathinfo($filename, PATHINFO_FILENAME));

            // Idempotency check: skip if this code was registered in a previous run
            if (PhotoRegistry::where('registry_code', $code)->exists()) {
                $this->line("  [SKIP] {$code} (already registered)");
                $skipped++;
                continue;
            }

            // user_id is null at registration time — gets assigned when a customer places
            // their first reprint order for this photo via /order/reprint
            PhotoRegistry::create([
                'registry_code' => $code,
                'user_id'       => null,
                'photo_paths'   => [$path],   // full relative path stored as JSON array, e.g. ["old-photo-storage/FDCL-001001.jpg"]
                'notes'         => null,
                'expires_at'    => null,      // no expiry for studio-uploaded photos
            ]);

            $this->line("  [NEW]  {$code}");
            $created++;
        }

        $this->info("Done. {$created} created, {$skipped} skipped.");

        return self::SUCCESS;
    }
}
