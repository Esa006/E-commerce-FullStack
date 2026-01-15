<?php

use App\Models\Product;

$brands = ['H&M', 'Zara', 'Nike', 'Adidas', 'Puma', 'Levis', 'Gucci', 'Prada', 'Gap', 'Uniqlo'];

Product::all()->each(function($p) use ($brands) {
    $p->brand = $brands[array_rand($brands)];
    $p->save();
});

echo "Brands assigned successfully.";
