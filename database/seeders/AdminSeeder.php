<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; 
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
   
    public function run(): void
    {
      
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (!$admin) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password123'), 
                'role' => User::ROLE_ADMIN,
                'phone' => '9876543210',
                'address' => 'Admin HQ, Chennai',
            ]);
            
            echo "\nAdmin User Created Successfully!\n";
        } else {
            echo "\n Admin User Already Exists.\n";
        }
    }
}