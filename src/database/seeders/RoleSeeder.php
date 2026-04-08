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
        Role::create(['name' => 'customer']);
        Role::create(['name' => 'staff']);
        Role::create(['name' => 'admin']);

        // Get locations
        $shantinagar = Location::where('name', 'Shantinagar')->first();
        $gulshan = Location::where('name', 'Gulshan')->first();

        $admin = User::create([
            'name' => 'Faiz Ullah',
            'email' => 'admin@focusdigitalcolorlab.com',
            'password' => Hash::make('Admin@1234'),
        ]);
        $admin->assignRole('admin');

        $staffShantinagar = User::create([
            'name' => 'Staff Shantinagar',
            'email' => 'staff.shantinagar@focusdigitalcolorlab.com',
            'password' => Hash::make('Staff@1234'),
            'location_id' => $shantinagar?->id,
        ]);
        $staffShantinagar->assignRole('staff');

        $staffGulshan = User::create([
            'name' => 'Staff Gulshan',
            'email' => 'staff.gulshan@focusdigitalcolorlab.com',
            'password' => Hash::make('Staff@1234'),
            'location_id' => $gulshan?->id,
        ]);
        $staffGulshan->assignRole('staff');
    }
}
