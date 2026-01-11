<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    /**
     * Get products by category
     * @param string $category - Men, Women, or Kids
     */
    public function getByCategory($category)
    {
        $validCategories = ['Men', 'Women', 'Kids'];

        if (!in_array($category, $validCategories)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid category. Valid categories: Men, Women, Kids'
            ], 400);
        }

        $products = Product::where('category', $category)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'category' => $category,
            'count' => $products->count(),
            'products' => $products
        ]);
    }

    /**
     * Get new arrivals (latest 10 products)
     */
    public function getNewArrivals()
    {
        $products = Product::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'count' => $products->count(),
            'products' => $products
        ]);
    }

    /**
     * Get bestsellers
     */
    public function getBestsellers()
    {
        $products = Product::where('bestseller', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $products->count(),
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product)
            return response()->json(['success' => false], 404);
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'price' => 'required|numeric',
                'image' => 'required|file|max:2048',
            ]);

            $imageArray = json_encode([]);
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $imageArray = json_encode([$path]);
            }

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description ?? '',
                'price' => $request->price,
                'image' => $imageArray,
                'category' => $request->category ?? 'Men',
                'subCategory' => $request->subCategory ?? 'Topwear',
                'sizes' => $request->sizes ? $request->sizes : json_encode(["S", "M", "L"]),
                'bestseller' => $request->bestseller === 'true' ? 1 : 0,
                'date' => now(),

            ]);

            return response()->json(['success' => true, 'product' => $product], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                'name' => 'required|string',
                'price' => 'required|numeric',
            ]);

            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->category = $request->category;
            $product->subCategory = $request->subCategory;

            // FIX: Handle null sizes and ensure it remains a valid JSON array
            $decodedSizes = json_decode($request->sizes);
            $product->sizes = !empty($decodedSizes) ? $decodedSizes : ["S", "M", "L"];

            $product->bestseller = ($request->bestseller === 'true' || $request->bestseller == 1) ? 1 : 0;

            if ($request->hasFile('image')) {
                $oldImages = json_decode($product->image);
                if (is_array($oldImages)) {
                    foreach ($oldImages as $oldImg) {
                        Storage::disk('public')->delete($oldImg);
                    }
                }
                $path = $request->file('image')->store('products', 'public');
                $product->image = json_encode([$path]);
            }

            $product->save();
            return response()->json(['success' => true, 'product' => $product]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Use find() instead of findOrFail() to handle the "missing" case manually
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already deleted or not found.'
                ], 404);
            }

            // ... rest of your image deletion and $product->delete() logic ...

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
    public function updateStock(Request $request, $id)
    {
        $request->validate(['stock' => 'required|integer|min:0']);

        $product = Product::findOrFail($id);
        $product->stock = $request->stock;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Stock updated successfully!']);
    }
}



