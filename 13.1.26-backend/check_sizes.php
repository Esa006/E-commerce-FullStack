<?php

use App\Models\OrderItem;
use Illuminate\Support\Facades\Schema;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking 'order_items' table for 'size' column...\n";
if (Schema::hasColumn('order_items', 'size')) {
    echo "Column 'size' exists.\n";
} else {
    echo "Column 'size' DOES NOT EXIST.\n";
    exit;
}

echo "\nLast 5 Order Items:\n";
$items = OrderItem::with('order')->orderBy('id', 'desc')->take(5)->get();

foreach ($items as $item) {
    echo "Order ID: " . ($item->order ? $item->order->order_number : 'N/A') . 
         " | Product ID: " . $item->product_id . 
         " | Size: " . ($item->size ?? 'NULL') . 
         " | Qty: " . $item->quantity . "\n";
}
