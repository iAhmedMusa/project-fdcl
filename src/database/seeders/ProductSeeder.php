<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $products = [
            // Photo Studio
            // ['name' => 'Passport/Stamp', 'category' => 'photo_studio', 'size_label' => '45×55mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 8],
            // ['name' => 'BD E-Passport', 'category' => 'photo_studio', 'size_label' => '45×35mm', 'width_mm' => 45, 'height_mm' => 35, 'price' => 10, 'copies_per_sheet' => 8],
            // ['name' => '3R Print', 'category' => 'photo_studio', 'size_label' => '3R', 'width_mm' => 89, 'height_mm' => 127, 'price' => 25, 'copies_per_sheet' => 1],
            // ['name' => '4R Print', 'category' => 'photo_studio', 'size_label' => '4R', 'width_mm' => 102, 'height_mm' => 152, 'price' => 30, 'copies_per_sheet' => 1],
            // ['name' => '5R Print', 'category' => 'photo_studio', 'size_label' => '5R', 'width_mm' => 127, 'height_mm' => 178, 'price' => 50, 'copies_per_sheet' => 1],
            // ['name' => 'A4 Print', 'category' => 'photo_studio', 'size_label' => 'A4', 'width_mm' => 210, 'height_mm' => 297, 'price' => 120, 'copies_per_sheet' => 1],

            // Photo Prints (2R–8R)

            // Reprint / Visa Photos
            // Visa photos are a common reprint category with specific size and background requirements. We can seed a variety of popular visa photo types to cover most customer needs.
            ['name' => 'Passport size (Bangladesh)', 'flag_emoji' => '🇧🇩', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1, 'description' => 'White background, matte finish, no glasses.', 'sort_order' => 1],
            ['name' => 'Australia', 'flag_emoji' => '🇦🇺', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'Plain light colored background, clear focus.', 'sort_order' => 2],
            ['name' => 'Bhutan', 'flag_emoji' => '🇧🇹', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, matte finish preferred, 60-80% face coverage.', 'sort_order' => 3],
            ['name' => 'Canada (Visa)', 'flag_emoji' => '🇨🇦', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, specific face height requirements.', 'sort_order' => 4],
            ['name' => 'China', 'flag_emoji' => '🇨🇳', 'category' => 'reprint', 'size_label' => '33×48mm', 'width_mm' => 33, 'height_mm' => 48, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, dark clothing recommended.', 'sort_order' => 5],
            ['name' => 'Finland', 'flag_emoji' => '🇫🇮', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'Plain light background, ears must be visible, no smiling.', 'sort_order' => 6],
            ['name' => 'Germany', 'flag_emoji' => '🇩🇪', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White or Light Gray background, 70-80% face coverage, biometric.', 'sort_order' => 7],
            ['name' => 'India (Visa)', 'flag_emoji' => '🇮🇳', 'category' => 'reprint', 'size_label' => '51×51mm', 'width_mm' => 51, 'height_mm' => 51, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, square format, 2x2 inches.', 'sort_order' => 8],
            ['name' => 'Indonesia', 'flag_emoji' => '🇮🇩', 'category' => 'reprint', 'size_label' => '40×60mm', 'width_mm' => 40, 'height_mm' => 60, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, recent photo.', 'sort_order' => 9],
            ['name' => 'Italy', 'flag_emoji' => '🇮🇹', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, high resolution, recent photo.', 'sort_order' => 10],
            ['name' => 'Japan', 'flag_emoji' => '🇯🇵', 'category' => 'reprint', 'size_label' => '45×45mm', 'width_mm' => 45, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, taken within last 6 months.', 'sort_order' => 11],
            ['name' => 'Malaysia', 'flag_emoji' => '🇲🇾', 'category' => 'reprint', 'size_label' => '35×50mm', 'width_mm' => 35, 'height_mm' => 50, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background for e-Visa.', 'sort_order' => 12],
            ['name' => 'Nepal', 'flag_emoji' => '🇳🇵', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, borderless, recent.', 'sort_order' => 13],
            ['name' => 'Netherlands', 'flag_emoji' => '🇳🇱', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'Light gray or white background, neutral expression.', 'sort_order' => 14],
            ['name' => 'Saudi Arabia', 'flag_emoji' => '🇸🇦', 'category' => 'reprint', 'size_label' => '40×60mm', 'width_mm' => 40, 'height_mm' => 60, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, no glasses, recent photo.', 'sort_order' => 15],
            ['name' => 'Singapore', 'flag_emoji' => '🇸🇬', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, matte finish, no borders.', 'sort_order' => 16],
            ['name' => 'South Korea', 'flag_emoji' => '🇰🇷', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, clothes should not be white.', 'sort_order' => 17],
            ['name' => 'Thailand', 'flag_emoji' => '🇹🇭', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background or light background, matte finish preferred.', 'sort_order' => 18],
            ['name' => 'Turkey', 'flag_emoji' => '🇹🇷', 'category' => 'reprint', 'size_label' => '50×60mm', 'width_mm' => 50, 'height_mm' => 60, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, biometric style.', 'sort_order' => 19],
            ['name' => 'United Arab Emirates', 'flag_emoji' => '🇦🇪', 'category' => 'reprint', 'size_label' => '43×55mm', 'width_mm' => 43, 'height_mm' => 55, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, high resolution.', 'sort_order' => 20],
            ['name' => 'United Kingdom', 'flag_emoji' => '🇬🇧', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'Cream or light gray background, no smiling.', 'sort_order' => 21],
            ['name' => 'USA (Visa/DV)', 'flag_emoji' => '🇺🇸', 'category' => 'reprint', 'size_label' => '51×51mm', 'width_mm' => 51, 'height_mm' => 51, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, 2x2 inches, no eyeglasses.', 'sort_order' => 22],
            ['name' => 'Vietnam', 'flag_emoji' => '🇻🇳', 'category' => 'reprint', 'size_label' => '40×60mm', 'width_mm' => 40, 'height_mm' => 60, 'price' => 20, 'copies_per_sheet' => 1, 'description' => 'White background, straight look, no hat.', 'sort_order' => 23],


            //---Standardized pricing for all reprint sizes for simplicity
            ['name' => '2R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '2R', 'width_mm' => 64, 'height_mm' => 89, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '2.5×3.5 inches, standard wallet size print.', 'sort_order' => 24],
            ['name' => '3R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '3R', 'width_mm' => 89, 'height_mm' => 127, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '3.5×5 inches, standard small print size.', 'sort_order' => 25],
            ['name' => '4R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '4R', 'width_mm' => 102, 'height_mm' => 152, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '4×6 inches, most popular photo print size.', 'sort_order' => 26],
            ['name' => '5R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '5R', 'width_mm' => 127, 'height_mm' => 178, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '5×7 inches, ideal for framing and gifting.', 'sort_order' => 27],
            ['name' => '6R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '6R', 'width_mm' => 152, 'height_mm' => 203, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '6×8 inches, great for display and albums.', 'sort_order' => 28],
            ['name' => '8R Print', 'flag_emoji' => '🖼️', 'category' => 'reprint', 'size_label' => '8R', 'width_mm' => 203, 'height_mm' => 254, 'price' => 35, 'copies_per_sheet' => 1, 'description' => '8×10 inches, large display print.', 'sort_order' => 29],

            // Albums
            ['name' => '50-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 200 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 500, 'copies_per_sheet' => 1, 'sort_order' => 30],
            ['name' => '100-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 400 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 900, 'copies_per_sheet' => 1, 'sort_order' => 31],
            ['name' => '150-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 600 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 1300, 'copies_per_sheet' => 1, 'sort_order' => 32],
            ['name' => '200-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 800 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 1700, 'copies_per_sheet' => 1, 'sort_order' => 33],
            ['name' => '250-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 1000 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 2100, 'copies_per_sheet' => 1, 'sort_order' => 34],
            ['name' => '300-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 1200 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 2500, 'copies_per_sheet' => 1, 'sort_order' => 35],

            // Frames
            ['name' => '2R Frame', 'category' => 'frame', 'size_label' => '2R', 'width_mm' => 64, 'height_mm' => 89, 'price' => 80, 'copies_per_sheet' => 1, 'sort_order' => 36],
            ['name' => '3R Frame', 'category' => 'frame', 'size_label' => '3R', 'width_mm' => 89, 'height_mm' => 127, 'price' => 120, 'copies_per_sheet' => 1, 'sort_order' => 37],
            ['name' => '4R Frame', 'category' => 'frame', 'size_label' => '4R', 'width_mm' => 102, 'height_mm' => 152, 'price' => 150, 'copies_per_sheet' => 1, 'sort_order' => 38],
            ['name' => '5R Frame', 'category' => 'frame', 'size_label' => '5R', 'width_mm' => 127, 'height_mm' => 178, 'price' => 200, 'copies_per_sheet' => 1, 'sort_order' => 39],
            ['name' => '6R Frame', 'category' => 'frame', 'size_label' => '6R', 'width_mm' => 152, 'height_mm' => 203, 'price' => 250, 'copies_per_sheet' => 1, 'sort_order' => 40],
            ['name' => '8R Frame', 'category' => 'frame', 'size_label' => '8R', 'width_mm' => 203, 'height_mm' => 254, 'price' => 300, 'copies_per_sheet' => 1, 'sort_order' => 41],
            ['name' => '10R Frame', 'category' => 'frame', 'size_label' => '10R', 'width_mm' => 254, 'height_mm' => 305, 'price' => 450, 'copies_per_sheet' => 1, 'sort_order' => 42],
            ['name' => '12R Frame', 'category' => 'frame', 'size_label' => '12R', 'width_mm' => 305, 'height_mm' => 457, 'price' => 550, 'copies_per_sheet' => 1, 'sort_order' => 43],
            ['name' => 'A4 Frame', 'category' => 'frame', 'size_label' => 'A4', 'width_mm' => 210, 'height_mm' => 297, 'price' => 350, 'copies_per_sheet' => 1, 'sort_order' => 44],
            ['name' => 'A3 Frame', 'category' => 'frame', 'size_label' => 'A3', 'width_mm' => 297, 'height_mm' => 420, 'price' => 600, 'copies_per_sheet' => 1, 'sort_order' => 45],
            ['name' => 'A2 Frame', 'category' => 'frame', 'size_label' => 'A2', 'width_mm' => 420, 'height_mm' => 594, 'price' => 1200, 'copies_per_sheet' => 1, 'sort_order' => 46],


            // Mugs
            ['name' => 'Single Mug', 'category' => 'mug', 'size_label' => 'Single', 'width_mm' => null, 'height_mm' => null, 'price' => 350, 'copies_per_sheet' => 1, 'sort_order' => 47],
            ['name' => 'Bulk Mug (10+)', 'category' => 'mug', 'size_label' => 'Bulk 10+', 'width_mm' => null, 'height_mm' => null, 'price' => 280, 'copies_per_sheet' => 1, 'sort_order' => 48],
        ];

        foreach ($products as &$product) {
            $product['is_active']      = true;
            $product['flag_emoji']     ??= null;
            $product['description']    ??= null;
            $product['min_quantity']   ??= 4;
            $product['quantity_step']  ??= 4;
            $product['created_at']     = $now;
            $product['updated_at']     = $now;
        }

        Product::upsert(
            $products,
            uniqueBy: ['name', 'category'],
            update: ['flag_emoji', 'size_label', 'width_mm', 'height_mm', 'price', 'copies_per_sheet', 'min_quantity', 'quantity_step', 'is_active', 'description', 'sort_order', 'updated_at']
        );
    }
}
