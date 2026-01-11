<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product; // 🟢 ADDED: Essential for checking stock
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index() {
        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();
        return response()->json($cartItems);
    }

    public function addToCart(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // 🟢 OPTIONAL: Check stock before adding to cart
        $product = Product::find($request->product_id);
        if ($product->stock < $request->quantity) {
             return response()->json(['message' => 'Sorry, we do not have enough stock.'], 400);
        }

        $cart = Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $request->product_id],
            ['quantity' => DB::raw("quantity + $request->quantity")]
        );

        return response()->json(['message' => 'Product added to cart', 'data' => $cart]);
    }

    public function updateQuantity(Request $request, $id) {
        $cart = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        
        // 🟢 OPTIONAL: Prevent increasing quantity beyond stock in the cart
        if ($cart->product->stock < $request->quantity) {
            return response()->json(['message' => 'Stock limit reached'], 400);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart quantity updated']);
    }

    public function removeFromCart($id) {
        Cart::where('id', $id)->where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Product removed from cart']);
    }
    
    // 🟢 NEW FUNCTION: Call this from React before navigating to Checkout
    // 🟢 CORRECTED FUNCTION: Matches React Data & Fixes "Undefined Key"
    public function validateCart(Request $request)
    {
        $request->validate([
            'cart_items' => 'required|array',
        ]);

        $errors = [];
        $updates = [];

        foreach ($request->cart_items as $item) {
            // 1. SAFE ID EXTRACTION
            // If 'product_id' is missing, fallback to 'id'
            // NOTE: Ensure 'id' here is the PRODUCT ID, not the Cart ID!
            $productId = $item['product_id'] ?? $item['id']; 

            $product = Product::find($productId);

            // 2. Check if product exists
            if (!$product) {
                $errors[] = "Item ID {$productId} no longer exists.";
                continue;
            }

            // 3. Check Real Database Stock vs Requested Quantity
            if ($product->stock < $item['quantity']) {
                $errors[] = "'{$product->name}' is out of stock. (Available: {$product->stock})";
                
                // 🟢 CRITICAL: Send this data so React can auto-fix the cart
                $updates[] = [
                    'id' => $productId,
                    'available_stock' => $product->stock
                ];
            }
        }

        // 4. Return Errors (409 Conflict)
        if (count($errors) > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Stock issues found.',
                'errors' => $errors,
                'updates' => $updates // <--- React needs this to update the UI
            ], 409);
        }

        // 5. Success
        return response()->json(['success' => true]);
    }
}