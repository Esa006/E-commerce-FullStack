<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$count = \App\Models\Product::where('bestseller', true)->count();
$total = \App\Models\Product::count();

echo "Total Products: " . $total . "\n";
echo "Bestseller Products Count: " . $count . "\n";

if ($count === 0) {
    echo "NO BESTSELLERS FOUND. Sample of data:\n";
    $sample = \App\Models\Product::limit(3)->get(['id', 'name', 'bestseller']);
    foreach($sample as $s) {
        echo "ID: {$s->id} | Name: {$s->name} | Bestseller: " . ($s->bestseller ? 'TRUE' : 'FALSE') . " (Raw: " . var_export($s->getAttributes()['bestseller'], true) . ")\n";
    }
} else {
    $bestsellers = \App\Models\Product::where('bestseller', true)->limit(5)->get(['id', 'name']);
    foreach($bestsellers as $b) {
        echo "ID: {$b->id} | Name: {$b->name}\n";
    }
}
