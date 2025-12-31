<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Test Product 1',
            'price' => 500,
            'description' => 'Test description',
            'image' => 'p_img1.png',
            'category' => 'Men',
            'subCategory' => 'Topwear',
            'sizes' => json_encode(['M', 'L']),
            'date' => now(),
            'bestseller' => true,
        ]);
    }
}