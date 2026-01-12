<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure the customer role exists
        $role = Role::firstOrCreate(['name' => 'customer']);

        // Create default customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name' => 'Default Customer',
                'password' => 'password123',
                'role' => 'customer', // Legacy column support
                'phone' => '1234567890',
                'address' => 'Customer Street, 123',
            ]
        );

        $customer->assignRole($role);

        echo "\nCustomer User Created: customer@gmail.com / password123\n";
    }
}
