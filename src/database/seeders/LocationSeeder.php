<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Location::upsert(
            [
                [
                    'name'             => 'Bailey Road',
                    'address'          => 'Bailey Road, Shantinagar Moar, Dhaka 1217',
                    'google_maps_url'  => 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
                    'phone'            => '01973140768',
                    'is_active'        => true,
                    'pathao_store_id'  => null, // TODO: set real Pathao store_id after production setup
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ],
                [
                    'name'             => 'Gulshan',
                    'address'          => 'House 05, Road 21, Gulshan 01, Dhaka 1212',
                    'google_maps_url'  => 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
                    'phone'            => '01973140768',
                    'is_active'        => true,
                    'pathao_store_id'  => null, // TODO: set real Pathao store_id after production setup
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ],
            ],
            uniqueBy: ['name'],
            update: ['address', 'google_maps_url', 'phone', 'is_active', 'pathao_store_id', 'updated_at']
        );
    }
}
