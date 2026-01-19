<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$updated = \App\Models\Product::where('id', '<=', 12)->update(['bestseller' => 1]);
echo "Updated $updated products to be bestsellers.\n";
