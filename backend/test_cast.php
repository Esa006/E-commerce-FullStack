<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = new User();
$user->password = 'plain';
echo "Assigned 'plain'. Model value: " . $user->password . "\n";

$user->password = Hash::make('plain');
echo "Assigned Hash::make('plain'). Model value: " . $user->password . "\n";
