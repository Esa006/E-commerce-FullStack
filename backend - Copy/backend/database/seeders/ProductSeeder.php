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
            ['name' => 'Women Round Neck Cotton Top', 'price' => 100, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img1.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 200, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img2_1.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 220, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img3.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 110, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img4.png'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 130, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img5.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 140, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img6.png'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 190, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img7.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 140, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img8.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 100, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img9.png'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 110, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img10.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 120, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img11.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 150, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img12.png'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 130, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img13.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 160, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img14.png'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 140, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img15.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 170, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img16.png'],
            ['name' => 'Men Tapered Fit Flat-Front Trousers', 'price' => 150, 'cat' => 'Men', 'sub' => 'Bottomwear', 'img' => 'p_img17.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 180, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img18.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 160, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img19.png'],
            ['name' => 'Women Palazzo Pants with Waist Belt', 'price' => 190, 'cat' => 'Women', 'sub' => 'Bottomwear', 'img' => 'p_img20.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 170, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img21.png'],
            ['name' => 'Women Palazzo Pants with Waist Belt', 'price' => 200, 'cat' => 'Women', 'sub' => 'Bottomwear', 'img' => 'p_img22.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 180, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img23.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 210, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img24.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 190, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img25.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 220, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img26.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 200, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img27.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 230, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img28.png'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 210, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img29.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 240, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img30.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 220, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img31.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 250, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img32.png'],
            ['name' => 'Girls Round Neck Cotton Top', 'price' => 230, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img33.png'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 260, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img34.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 240, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img35.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 270, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img36.png'],
            ['name' => 'Women Round Neck Cotton Top', 'price' => 250, 'cat' => 'Women', 'sub' => 'Topwear', 'img' => 'p_img37.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 280, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img38.png'],
            ['name' => 'Men Printed Plain Cotton Shirt', 'price' => 260, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img39.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 290, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img40.png'],
            ['name' => 'Men Round Neck Pure Cotton T-shirt', 'price' => 270, 'cat' => 'Men', 'sub' => 'Topwear', 'img' => 'p_img41.png'],
            ['name' => 'Boy Round Neck Pure Cotton T-shirt', 'price' => 300, 'cat' => 'Kids', 'sub' => 'Topwear', 'img' => 'p_img42.png'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 280, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img43.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 310, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img44.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 290, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img45.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 320, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img46.png'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 300, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img47.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 330, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img48.png'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 310, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img49.png'],
            ['name' => 'Kid Tapered Slim Fit Trouser', 'price' => 340, 'cat' => 'Kids', 'sub' => 'Bottomwear', 'img' => 'p_img50.png'],
            ['name' => 'Women Zip-Front Relaxed Fit Jacket', 'price' => 320, 'cat' => 'Women', 'sub' => 'Winterwear', 'img' => 'p_img51.png'],
            ['name' => 'Men Slim Fit Relaxed Denim Jacket', 'price' => 350, 'cat' => 'Men', 'sub' => 'Winterwear', 'img' => 'p_img52.png'],
        ];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'description' => "Premium " . $p['name'] . " for high quality comfort.",
                'price' => $p['price'],
                // FIX: Removed ([$p['img']]) and made it direct $p['img']
                'image' => [$p['img']],
                'category' => $p['cat'],
                'subCategory' => $p['sub'],
                'sizes' => json_encode(['S', 'M', 'L']),
                'bestseller' => false
            ]);
        }
    }
}
