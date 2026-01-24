<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Mass assignment data for all 52 products
        $products = [
            ['name' => 'Women Round Neck Cotton Top', 'price' => 100, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img1.png', 'brand' => 'H&M'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 200, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img2_1.png', 'brand' => 'Nike'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 220, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img3.png', 'brand' => 'Gap Kids'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 110, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img4.png', 'brand' => 'Puma'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 130, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img5.png', 'brand' => 'Zara'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 140, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img6.png', 'brand' => 'H&M'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 190, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img7.png', 'brand' => 'Levis'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 140, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img8.png', 'brand' => 'Uniqlo'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 100, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img9.png', 'brand' => 'Gap Kids'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 110, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img10.png', 'brand' => 'Dockers'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 120, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img11.png', 'brand' => 'Adidas'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 150, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img12.png', 'brand' => 'Nike'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 130, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img13.png', 'brand' => 'Forever 21'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 160, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img14.png', 'brand' => 'Puma'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 140, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img15.png', 'brand' => 'Levis'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 170, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img16.png', 'brand' => 'Zara Kids'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 150, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img17.png', 'brand' => 'Van Heusen'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 180, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img18.png', 'brand' => 'Nike'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 160, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img19.png', 'brand' => 'Adidas'],
            ['name' => 'Women Palazzo Pants with Waist Belt', 'price' => 190, 'cat' => 'Women', 'sub' => 'Bottomwear', 'img' => 'p_img20.png', 'brand' => 'FabIndia'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 170, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img21.png', 'brand' => 'Columbia'],
            ['name' => 'Women Palazzo Pants with Waist Belt', 'price' => 200, 'cat' => 'Women', 'sub' => 'Bottomwear', 'img' => 'p_img22.png', 'brand' => 'Biba'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 180, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img23.png', 'brand' => 'Puma'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 210, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img24.png', 'brand' => 'United Colors of Benetton'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 190, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img25.png', 'brand' => 'H&M'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 220, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img26.png', 'brand' => 'North Face'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 200, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img27.png', 'brand' => 'Zara Kids'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 230, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img28.png', 'brand' => 'Levis'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 210, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img29.png', 'brand' => 'Mango'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 240, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img30.png', 'brand' => 'Gap Kids'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 220, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img31.png', 'brand' => 'Nike'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 250, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img32.png', 'brand' => 'Adidas'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 230, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img33.png', 'brand' => 'H&M'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 260, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img34.png', 'brand' => 'Vero Moda'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 240, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img35.png', 'brand' => 'Columbia'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 270, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img36.png', 'brand' => 'North Face'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 250, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img37.png', 'brand' => 'Mango'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 280, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img38.png', 'brand' => 'Puma'],
            ['name' => 'Men Printed Plain Cotton Shirt', 'price' => 260, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img39.png', 'brand' => 'Tommy Hilfiger'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 290, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img40.png', 'brand' => 'Wrangler'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 270, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img41.png', 'brand' => 'Under Armour'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 300, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img42.png', 'brand' => 'Nike'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 280, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img43.png', 'brand' => 'Gap Kids'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 310, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img44.png', 'brand' => 'Patagonia'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 290, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img45.png', 'brand' => 'Levis'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 320, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img46.png', 'brand' => 'Lee'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 300, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img47.png', 'brand' => 'H&M'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 330, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img48.png', 'brand' => 'Diesel'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 310, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img49.png', 'brand' => 'Zara Kids'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 340, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img50.png', 'brand' => 'Ralph Lauren'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 320, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img51.png', 'brand' => 'Columbia'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 350, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img52.png', 'brand' => 'Levis'],
        ];

        $brands = ['H&M', 'Zara', 'Nike', 'Adidas', 'Puma', 'Levis', 'Gucci', 'Prada', 'Gap', 'Uniqlo'];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'brand' => $p['brand'],
                'description' => $p['description'] ?? "Premium " . $p['name'] . " for high quality comfort. Made from the finest materials to ensure durability and style.",
                'price' => $p['price'],
                // FIX: Removed ([$p['img']]) and made it direct $p['img']
                'image' => [$p['img']],
                'category' => $p['cat'],
                'subCategory' => $p['sub'],
                'sizes' => json_encode(['S', 'M', 'L']),
                'bestseller' => false,
                'rating' => rand(1, 5)
            ]);
        }
    }
}
