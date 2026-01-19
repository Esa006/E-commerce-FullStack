<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Backpack Admin Password Reset ===\n\n";

// Find or create admin user
$admin = User::where('email', 'admin@admin.com')->first();

if (!$admin) {
    echo "Creating new admin user...\n";
    $admin = User::create([
        'name' => 'Admin',
        'email' => 'admin@admin.com',
        'password' => Hash::make('admin123'),
    ]);
    
    // Assign admin role if using Spatie permissions
    try {
        $admin->assignRole('admin');
        echo "✓ Admin role assigned\n";
    } catch (\Exception $e) {
        echo "Note: Could not assign role (might not be using roles)\n";
    }
} else {
    echo "Updating existing admin user...\n";
    $admin->password = Hash::make('admin123');
    $admin->save();
}

echo "\n✓ Admin password reset successfully!\n\n";
echo "Login Credentials:\n";
echo "==================\n";
echo "Email: admin@admin.com\n";
echo "Password: admin123\n";
echo "URL: http://localhost:8000/admin\n\n";
