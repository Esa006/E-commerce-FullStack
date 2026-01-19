<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Find the product seen in the screenshot
$productName = "Men Round Neck Pure Cotton T-shirt";
$product = Product::where('name', $productName)->first();

echo "--- PRODUCT DEBUG ---\n";
if ($product) {
    echo "ID: " . $product->id . "\n";
    echo "Name: " . $product->name . "\n";
    // Encode to JSON string for display if it's an array/object
    echo "Image (Raw from DB): " . json_encode($product->image) . "\n";
} else {
    echo "Product '$productName' not found.\n";
}

echo "\n--- ORDER ITEMS DEBUG (Latest 5) ---\n";
// 2. precise inspection of order items for this product or recent ones
$items = OrderItem::with(['order', 'product'])
    ->orderBy('id', 'desc')
    ->take(5)
    ->get();

foreach ($items as $item) {
    echo "OrderItem ID: " . $item->id . "\n";
    echo "Order: " . ($item->order ? $item->order->order_number : 'Orphaned') . "\n";
    echo "Product: " . ($item->product ? $item->product->name : 'Deleted') . "\n";
    echo "Size (DB): " . ($item->size ? $item->size : 'NULL') . "\n";
    
    $prodImg = $item->product ? $item->product->image : null;
    echo "Image (from Product): " . json_encode($prodImg) . "\n";
    echo "--------------------------\n";
}
