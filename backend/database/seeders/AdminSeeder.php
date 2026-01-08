<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role; // <--- 1. Import Spatie Role model

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 2. Ensure the Spatie role exists first
        // If 'admin' isn't in the 'roles' table, this creates it.
        $role = Role::firstOrCreate(['name' => 'admin']);

        // Search for existing admin
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (!$admin) {
            $newAdmin = User::create([
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'admin', // Keeps your legacy column working
                'phone' => '9876543210',
                'address' => 'Admin HQ, Chennai',
            ]);

            // 3. Assign the Spatie role to the new user
            $newAdmin->assignRole($role);

            echo "\nAdmin User Created and Spatie Role Assigned!\n";

        } else {
            // If user exists, update both systems
            $admin->update(['role' => 'admin']); // Update legacy column
            $admin->assignRole($role);           // Update Spatie table

            echo "\nAdmin User role updated to 'admin' in both column and Spatie tables.\n";
        }
    }
}