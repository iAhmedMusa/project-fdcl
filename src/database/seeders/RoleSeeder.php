<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'customer']);
        Role::firstOrCreate(['name' => 'staff']);
        Role::firstOrCreate(['name' => 'admin']);

        // Get locations
        $baileyRoad = Location::where('name', 'Bailey Road')->first();
        $gulshan = Location::where('name', 'Gulshan')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@focusdigitalcolorlab.com'],
            [
                'name' => 'Faiz Ullah',
                'password' => Hash::make('Admin@1234'),
            ]
        );
        $admin->syncRoles(['admin']);

        $staffBaileyRoad = User::firstOrCreate(
            ['email' => 'staff.baileyroad@focusdigitalcolorlab.com'],
            [
                'name' => 'Staff Bailey Road',
                'password' => Hash::make('Staff@1234'),
                'location_id' => $baileyRoad?->id,
            ]
        );
        $staffBaileyRoad->syncRoles(['staff']);

        $staffGulshan = User::firstOrCreate(
            ['email' => 'staff.gulshan@focusdigitalcolorlab.com'],
            [
                'name' => 'Staff Gulshan',
                'password' => Hash::make('Staff@1234'),
                'location_id' => $gulshan?->id,
            ]
        );
        $staffGulshan->syncRoles(['staff']);
    }
}
