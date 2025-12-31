<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    
    public function index() {
        return response()->json(Product::all());
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $data = $request->all();

      if ($request->hasFile('image')) {
           
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product added successfully!',
            'product' => $product
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
      
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
    
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }

 
public function destroy($id) {
    $product = Product::find($id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $product->delete();
    return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
}


}