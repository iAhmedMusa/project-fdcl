<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Ahmed Musa',
                'phone' => '01713194608',
                'email' => 'ahmed@focusdigitalcolorlab.com',
                'address' => 'House 470, Road 06, Avenue 06, Mirpur DOHS',
            ],
            [
                'name' => 'Ahmed Ayaan Zulqarnain',
                'phone' => '01515261283',
                'email' => 'ayaan@focusdigitalcolorlab.com',
                'address' => 'House 470, Road 06, Avenue 06, Mirpur DOHS',
            ],
            [
                'name' => 'Samia Ahmed',
                'phone' => '01729249608',
                'email' => 'xsamia007@gmail.com',
                'address' => 'House 470, Road 06, Avenue 06, Mirpur DOHS',
            ],
            [
                'name' => 'Rafiqul Islam',
                'phone' => '01812345678',
                'email' => 'rafiqul@example.com',
                'address' => '123 Dhanmondi, Dhaka',
            ],
            [
                'name' => 'Fatima Begum',
                'phone' => '01987654321',
                'email' => 'fatima@example.com',
                'address' => '456 Gulshan, Dhaka',
            ],
            [
                'name' => 'Karim Hossain',
                'phone' => '01611122233',
                'email' => 'karim@example.com',
                'address' => '789 Uttara, Dhaka',
            ],
            [
                'name' => 'Nusrat Jahan',
                'phone' => '01733344455',
                'email' => 'nusrat@example.com',
                'address' => '321 Mirpur, Dhaka',
            ],
            [
                'name' => 'Abdul Rahman',
                'phone' => '01855566677',
                'email' => 'abdul@example.com',
                'address' => '654 Mohammadpur, Dhaka',
            ],
            [
                'name' => 'Tasnim Akter',
                'phone' => '01977788899',
                'email' => 'tasnim@example.com',
                'address' => '987 Banani, Dhaka',
            ],
            [
                'name' => 'Imran Khan',
                'phone' => '01444455566',
                'email' => 'imran@example.com',
                'address' => '147 Wari, Dhaka',
            ],
            [
                'name' => 'Salma Khatun',
                'phone' => '01588899900',
                'email' => 'salma@example.com',
                'address' => '258 Chawkbazar, Dhaka',
            ],
        ];

        foreach ($customers as $data) {
            $customer = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'password' => Hash::make('Customer@1234'),
                    'address' => $data['address'],
                    'is_active' => true,
                ]
            );
            $customer->syncRoles(['customer']);
        }
    }
}
