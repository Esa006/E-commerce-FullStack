<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Reset cached roles and permissions to ensure fresh start
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Roles
        // We use firstOrCreate to prevent duplicates if seeder runs twice
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'customer']);

        // Optional: You can create other roles here too
        // Role::firstOrCreate(['name' => 'editor']);

        echo "Roles 'admin' and 'customer' created successfully.\n";
    }
}