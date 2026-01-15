<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('email', 'admin@gmail.com')->first();
if ($user) {
    $user->password = 'password123'; // Cast 'hashed' in User model will handle hashing automatically.
    $user->save();
    echo "Password reset successfully for {$user->email}.\n";
} else {
    echo "User not found.\n";
}
