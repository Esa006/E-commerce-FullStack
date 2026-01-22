<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // 1. Search Logic (Name & Description)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // 2. Filter Logic (Brands)
        if ($request->filled('brand')) {
            $brands = explode(',', $request->brand);
            $query->whereIn('brand', $brands);
        }

        // 3. Filter Logic (Categories)
        if ($request->filled('category')) {
            $categories = array_map('trim', explode(',', $request->category));
            $query->whereIn('category', $categories);
        }

        // 4. Sorting Logic
        switch ($request->sort) {
            case 'low-high':
                $query->orderBy('price', 'asc');
                break;
            case 'high-low':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // 5. Pagination (Dynamic per_page with max limit)
        $perPage = min((int) $request->input('per_page',12), 60); // Default 12, max 60
        $products = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function getCategories()
    {
        $categories = Product::select('category')->distinct()->whereNotNull('category')->pluck('category');
        return response()->json(['success' => true, 'categories' => $categories]);
    }

    public function getBrands()
    {
        $brands = Product::select('brand')->distinct()->whereNotNull('brand')->pluck('brand');
        return response()->json(['success' => true, 'brands' => $brands]);
    }

    /**
     * Get products by category
     * @param string $category - Men, Women, or Kids
     */
    public function getByCategory(Request $request, $category)
    {
        $validCategories = ['Men', 'Women', 'Kids'];

        if (!in_array($category, $validCategories)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid category. Valid categories: Men, Women, Kids'
            ], 400);
        }

        $query = Product::where('category', $category);

        if ($request->has('brand')) {
            $brands = explode(',', $request->brand);
            $query->whereIn('brand', $brands);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

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

        $canReview = false;
        // Check if user is authenticated via Sanctum
        $user = auth('sanctum')->user();
        
        if ($user) {
            // Check if user has a delivered order for this product
            $hasDeliveredOrder = \App\Models\Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->whereHas('orderItems', function ($query) use ($id) {
                    $query->where('product_id', $id);
                })
                ->exists();
            
            $canReview = $hasDeliveredOrder;
        }

        $productData = $product->toArray();
        $productData['can_review'] = $canReview;

        return response()->json(['success' => true, 'data' => $productData]);
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



