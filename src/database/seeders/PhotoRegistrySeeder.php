<?php

namespace Database\Seeders;

use App\Models\PhotoRegistry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PhotoRegistrySeeder extends Seeder
{
    public function run(): void
    {
        // Create a demo customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@focusdigitalcolorlab.com'],
            [
                'name' => 'Ahmed Musa',
                'phone' => '01713194608',
                'password' => Hash::make('Customer@1234'),
                'address' => 'House 470, Road 06, Avenue 06, Mirpur DOHS',
            ]
        );
        $customer->syncRoles(['customer']);

        // Fixed registry codes for easy testing — no user or order attached yet.
        // A customer claims a registry only after placing a reprint order.
        $registries = [
            ['code' => 'FDCL-001001', 'color' => [66, 133, 244], 'label' => 'Portrait 1'],
            ['code' => 'FDCL-001002', 'color' => [219, 68, 55], 'label' => 'Portrait 2'],
            ['code' => 'FDCL-001003', 'color' => [244, 180, 0], 'label' => 'Portrait 3'],
            ['code' => 'FDCL-001004', 'color' => [15, 157, 88], 'label' => 'Portrait 4'],
            ['code' => 'FDCL-001005', 'color' => [102, 51, 153], 'label' => 'Portrait 5'],
            ['code' => 'FDCL-001006', 'color' => [231, 76, 60], 'label' => 'Portrait 6'],
            ['code' => 'FDCL-001007', 'color' => [46, 204, 113], 'label' => 'Portrait 7'],
            ['code' => 'FDCL-001008', 'color' => [52, 152, 219], 'label' => 'Portrait 8'],
            ['code' => 'FDCL-001009', 'color' => [155, 89, 182], 'label' => 'Portrait 9'],
            ['code' => 'FDCL-001010', 'color' => [241, 196, 15], 'label' => 'Portrait 10'],
            ['code' => 'FDCL-001011', 'color' => [230, 126, 34], 'label' => 'Portrait 11'],
            ['code' => 'FDCL-001012', 'color' => [26, 188, 156], 'label' => 'Portrait 12'],
            ['code' => 'FDCL-001013', 'color' => [142, 68, 173], 'label' => 'Portrait 13'],
            ['code' => 'FDCL-001014', 'color' => [44, 62, 80], 'label' => 'Portrait 14'],
            ['code' => 'FDCL-001015', 'color' => [192, 57, 43], 'label' => 'Portrait 15'],
        ];

        foreach ($registries as $entry) {
            $filename = strtolower($entry['code']).'.jpeg';
            $directory = 'photos/registry';
            $path = $directory.'/'.$filename;

            // Only generate if file doesn't exist
            if (! Storage::disk('public')->exists($path)) {
                $this->generatePlaceholderImage($path, $entry['color'], $entry['code']);
            }

            PhotoRegistry::firstOrCreate(
                ['registry_code' => $entry['code']],
                [
                    'user_id' => null,
                    'photo_paths' => [$path],
                    'notes' => 'Demo '.$entry['label'],
                    'expires_at' => now()->addYear(),
                ]
            );
        }
    }

    private function generatePlaceholderImage(string $storagePath, array $rgb, string $code): void
    {
        $width = 400;
        $height = 500;

        $img = imagecreatetruecolor($width, $height);

        $bg = imagecolorallocate($img, $rgb[0], $rgb[1], $rgb[2]);
        imagefill($img, 0, 0, $bg);

        $lightBg = imagecolorallocate($img, min(255, $rgb[0] + 40), min(255, $rgb[1] + 40), min(255, $rgb[2] + 40));

        imagefilledellipse($img, $width / 2, 160, 140, 160, $lightBg);
        imagefilledellipse($img, $width / 2, 420, 260, 200, $lightBg);

        $textColor = imagecolorallocate($img, 255, 255, 255);
        $fontSize = 4;
        $textWidth = imagefontwidth($fontSize) * strlen($code);
        imagestring($img, $fontSize, (int) (($width - $textWidth) / 2), $height - 30, $code, $textColor);

        $label = 'FDCL Studio Photo';
        $labelWidth = imagefontwidth($fontSize) * strlen($label);
        imagestring($img, $fontSize, (int) (($width - $labelWidth) / 2), 20, $label, $textColor);

        $fullPath = Storage::disk('public')->path($storagePath);
        $dir = dirname($fullPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        imagejpeg($img, $fullPath, 85);
        imagedestroy($img);
    }
}
