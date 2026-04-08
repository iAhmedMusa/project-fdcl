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

            // Photo Studio
            ['name' => 'Passport Size', 'category' => 'reprint', 'size_label' => '45×55mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 8],
            ['name' => 'BD E-Passport', 'category' => 'reprint', 'size_label' => '45×35mm', 'width_mm' => 45, 'height_mm' => 35, 'price' => 10, 'copies_per_sheet' => 8],
            // ['name' => '3R Print', 'category' => 'reprint', 'size_label' => '3R', 'width_mm' => 89, 'height_mm' => 127, 'price' => 25, 'copies_per_sheet' => 1],
            // ['name' => '4R Print', 'category' => 'reprint', 'size_label' => '4R', 'width_mm' => 102, 'height_mm' => 152, 'price' => 30, 'copies_per_sheet' => 1],
            // ['name' => '5R Print', 'category' => 'reprint', 'size_label' => '5R', 'width_mm' => 127, 'height_mm' => 178, 'price' => 50, 'copies_per_sheet' => 1],
            // ['name' => 'A4 Print', 'category' => 'reprint', 'size_label' => 'A4', 'width_mm' => 210, 'height_mm' => 297, 'price' => 120, 'copies_per_sheet' => 1],

            // Reprint / Visa Photos
            ['name' => 'Afghanistan', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Albania', 'category' => 'reprint', 'size_label' => '36×47mm', 'width_mm' => 36, 'height_mm' => 47, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Algeria', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Angola', 'category' => 'reprint', 'size_label' => '30×40mm', 'width_mm' => 30, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Argentina', 'category' => 'reprint', 'size_label' => '40×40mm', 'width_mm' => 40, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Armenia', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Australia', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Austria', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Azerbaijan', 'category' => 'reprint', 'size_label' => '30×40mm', 'width_mm' => 30, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bahamas', 'category' => 'reprint', 'size_label' => '51×51mm', 'width_mm' => 51, 'height_mm' => 51, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bahrain', 'category' => 'reprint', 'size_label' => '40×60mm', 'width_mm' => 40, 'height_mm' => 60, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bangladesh', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Barbados', 'category' => 'reprint', 'size_label' => '50×50mm', 'width_mm' => 50, 'height_mm' => 50, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Belarus', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Belgium', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Belize', 'category' => 'reprint', 'size_label' => '51×51mm', 'width_mm' => 51, 'height_mm' => 51, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Benin', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bhutan', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bolivia', 'category' => 'reprint', 'size_label' => '30×30mm', 'width_mm' => 30, 'height_mm' => 30, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bosnia and Herzegovina', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Botswana', 'category' => 'reprint', 'size_label' => '30×40mm', 'width_mm' => 30, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Brazil', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Brunei', 'category' => 'reprint', 'size_label' => '35×42mm', 'width_mm' => 35, 'height_mm' => 42, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Bulgaria', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Burkina Faso', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Cambodia', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Cameroon', 'category' => 'reprint', 'size_label' => '40×40mm', 'width_mm' => 40, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Canada', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Chad', 'category' => 'reprint', 'size_label' => '50×50mm', 'width_mm' => 50, 'height_mm' => 50, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Chile', 'category' => 'reprint', 'size_label' => '20×30mm', 'width_mm' => 20, 'height_mm' => 30, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'China', 'category' => 'reprint', 'size_label' => '33×48mm', 'width_mm' => 33, 'height_mm' => 48, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Colombia', 'category' => 'reprint', 'size_label' => '30×40mm', 'width_mm' => 30, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Comoros', 'category' => 'reprint', 'size_label' => '51×51mm', 'width_mm' => 51, 'height_mm' => 51, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Congo', 'category' => 'reprint', 'size_label' => '40×40mm', 'width_mm' => 40, 'height_mm' => 40, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Costa Rica', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Croatia', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Cuba', 'category' => 'reprint', 'size_label' => '45×45mm', 'width_mm' => 45, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Cyprus', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Czech Republic', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Denmark', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],
            ['name' => 'Germany', 'category' => 'reprint', 'size_label' => '35×45mm', 'width_mm' => 35, 'height_mm' => 45, 'price' => 10, 'copies_per_sheet' => 1],

            // Albums
            ['name' => '50-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 200 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 500, 'copies_per_sheet' => 1],
            ['name' => '100-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 400 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 900, 'copies_per_sheet' => 1],
            ['name' => '150-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 600 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 1300, 'copies_per_sheet' => 1],
            ['name' => '200-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 800 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 1700, 'copies_per_sheet' => 1],
            ['name' => '250-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 1000 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 2100, 'copies_per_sheet' => 1],
            ['name' => '300-Page Album', 'category' => 'album', 'size_label' => '- Fits up to 1200 photos', 'width_mm' => null, 'height_mm' => null, 'price' => 2500, 'copies_per_sheet' => 1],

            // Frames
            ['name' => '2R Frame', 'category' => 'frame', 'size_label' => '2R', 'width_mm' => 64, 'height_mm' => 89, 'price' => 80, 'copies_per_sheet' => 1],
            ['name' => '3R Frame', 'category' => 'frame', 'size_label' => '3R', 'width_mm' => 89, 'height_mm' => 127, 'price' => 120, 'copies_per_sheet' => 1],
            ['name' => '4R Frame', 'category' => 'frame', 'size_label' => '4R', 'width_mm' => 102, 'height_mm' => 152, 'price' => 150, 'copies_per_sheet' => 1],
            ['name' => '5R Frame', 'category' => 'frame', 'size_label' => '5R', 'width_mm' => 127, 'height_mm' => 178, 'price' => 200, 'copies_per_sheet' => 1],
            ['name' => '6R Frame', 'category' => 'frame', 'size_label' => '6R', 'width_mm' => 152, 'height_mm' => 203, 'price' => 250, 'copies_per_sheet' => 1],
            ['name' => '8R Frame', 'category' => 'frame', 'size_label' => '8R', 'width_mm' => 203, 'height_mm' => 254, 'price' => 300, 'copies_per_sheet' => 1],
            ['name' => '10R Frame', 'category' => 'frame', 'size_label' => '10R', 'width_mm' => 254, 'height_mm' => 305, 'price' => 450, 'copies_per_sheet' => 1],
            ['name' => '12R Frame', 'category' => 'frame', 'size_label' => '12R', 'width_mm' => 305, 'height_mm' => 457, 'price' => 550, 'copies_per_sheet' => 1],
            ['name' => 'A4 Frame', 'category' => 'frame', 'size_label' => 'A4', 'width_mm' => 210, 'height_mm' => 297, 'price' => 350, 'copies_per_sheet' => 1],
            ['name' => 'A3 Frame', 'category' => 'frame', 'size_label' => 'A3', 'width_mm' => 297, 'height_mm' => 420, 'price' => 600, 'copies_per_sheet' => 1],
            ['name' => 'A2 Frame', 'category' => 'frame', 'size_label' => 'A2', 'width_mm' => 420, 'height_mm' => 594, 'price' => 1200, 'copies_per_sheet' => 1],


            // Mugs
            ['name' => 'Single Mug', 'category' => 'mug', 'size_label' => 'Single', 'width_mm' => null, 'height_mm' => null, 'price' => 350, 'copies_per_sheet' => 1],
            ['name' => 'Bulk Mug (10+)', 'category' => 'mug', 'size_label' => 'Bulk 10+', 'width_mm' => null, 'height_mm' => null, 'price' => 280, 'copies_per_sheet' => 1],
        ];

        foreach ($products as &$product) {
            $product['is_active'] = true;
            $product['description'] = null;
            $product['created_at'] = $now;
            $product['updated_at'] = $now;
        }

        Product::insert($products);
    }
}
