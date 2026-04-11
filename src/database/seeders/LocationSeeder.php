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
                'name' => 'Shantinagar',
                'address' => 'Shantinagar Moar, Bailey Road, Dhaka',
                'google_maps_url' => 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
                'phone' => '01973140768',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gulshan',
                'address' => 'House 5, Road 21, Gulshan-1, Dhaka 1212',
                'google_maps_url' => 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
                'phone' => '01973140768',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
