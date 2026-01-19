<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

$email = 'admin@gmail.com';
$password = 'password123';

echo "Debugging Login for: $email / $password\n";

$user = User::where('email', $email)->first();

if (!$user) {
    die("User NOT FOUND in database.\n");
}

echo "User found. ID: " . $user->id . "\n";
echo "Stored Hash: " . $user->password . "\n";

// Manual Hash Check
if (Hash::check($password, $user->password)) {
    echo "Manual Hash::check passed.\n";
} else {
    echo "Manual Hash::check FAILED.\n";
}

// Attempt 'web' guard
if (Auth::guard('web')->attempt(['email' => $email, 'password' => $password])) {
    echo "Auth::guard('web')->attempt SUCCESS.\n";
} else {
    echo "Auth::guard('web')->attempt FAILED.\n";
}

// Attempt 'backpack' guard
try {
    if (Auth::guard('backpack')->attempt(['email' => $email, 'password' => $password])) {
        echo "Auth::guard('backpack')->attempt SUCCESS.\n";
    } else {
        echo "Auth::guard('backpack')->attempt FAILED.\n";
    }
} catch (\Exception $e) {
    echo "Auth::guard('backpack') threw exception: " . $e->getMessage() . "\n";
}
