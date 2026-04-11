<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Location::insert([
            [
'name' => 'Bailey Road',
                'address' => 'Bailey Road, Shantinagar Moar, Dhaka 1217',
                'google_maps_url' => 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
                'phone' => '01973140768',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gulshan',
                'address' => 'House 05, Road 21, Gulshan 01, Dhaka 1212',
                'google_maps_url' => 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
                'phone' => '01973140768',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
