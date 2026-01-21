<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Get the current user's cart with product details.
     */
    public function index() {
        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();
        
        // Clean up items where product no longer exists
        $cleaned = false;
        foreach ($cartItems as $key => $item) {
            if (!$item->product) {
                $item->delete();
                unset($cartItems[$key]); // Remove from current collection
                $cleaned = true;
            }
        }
        
        return response()->json($cleaned ? $cartItems->values() : $cartItems);
    }

    /**
     * Add a product to the cart or increment quantity.
     */
    public function addToCart(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string'
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Find existing item with same product and size
        $existingItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->first();

        $newQuantity = ($existingItem ? $existingItem->quantity : 0) + $request->quantity;

        if ($product->stock < $newQuantity) {
            return response()->json([
                'message' => 'Insufficient stock.',
                'available_stock' => $product->stock
            ], 400);
        }

        Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $request->product_id, 'size' => $request->size],
            ['quantity' => $newQuantity]
        );

        return response()->json([
            'message' => 'Product added to cart',
            'cart' => $this->getCartState()
        ]);
    }

    /**
     * Update quantity of a specific cart item.
     */
    public function updateQuantity(Request $request, $id) {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $cart = Cart::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        
        // Safety Check: If product was deleted but cart item remains
        if (!$cart->product) {
            $cart->delete();
            return response()->json([
                'message' => 'Product no longer available (removed from cart)',
                'cart' => $this->getCartState()
            ], 404); 
        }
        
        if ($cart->product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Stock limit reached',
                'available_stock' => $cart->product->stock
            ], 400);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Cart quantity updated',
            'cart' => $this->getCartState()
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function removeFromCart($id) {
        Cart::where('id', $id)->where('user_id', Auth::id())->delete();
        
        return response()->json([
            'message' => 'Product removed from cart',
            'cart' => $this->getCartState()
        ]);
    }

    /**
     * Merge guest cart items into the authenticated user's cart.
     */
    public function sync(Request $request) {
        $request->validate([
            'cart_items' => 'required|array',
            'cart_items.*.product_id' => 'required|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.size' => 'nullable|string'
        ]);

        foreach ($request->cart_items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) continue;

            $existingItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $item['product_id'])
                ->where('size', $item['size'] ?? null)
                ->first();

            // Merge strategy: Sum quantities but cap at stock
            $totalQty = ($existingItem ? $existingItem->quantity : 0) + $item['quantity'];
            $finalQty = min($totalQty, $product->stock);

            if ($finalQty > 0) {
                Cart::updateOrCreate(
                    ['user_id' => Auth::id(), 'product_id' => $item['product_id'], 'size' => $item['size'] ?? null],
                    ['quantity' => $finalQty]
                );
            }
        }

        return response()->json([
            'message' => 'Cart synchronized',
            'cart' => $this->getCartState()
        ]);
    }

    /**
     * Validate cart against real-time stock (Pre-checkout).
     */
    public function validateCart(Request $request) {
        $request->validate(['cart_items' => 'required|array']);

        $errors = [];
        $updates = [];

        foreach ($request->cart_items as $item) {
            $productId = $item['product_id'] ?? $item['id']; 
            $product = Product::find($productId);

            if (!$product) {
                $errors[] = "Item ID {$productId} no longer exists.";
                continue;
            }

            if ($product->stock < $item['quantity']) {
                $errors[] = "'{$product->name}' is out of stock. (Available: {$product->stock})";
                $updates[] = ['id' => $productId, 'available_stock' => $product->stock];
            }
        }

        if (count($errors) > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Stock issues found.',
                'errors' => $errors,
                'updates' => $updates 
            ], 409);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Helper to get full cart state for the user.
     */
    private function getCartState() {
        return Cart::with('product')->where('user_id', Auth::id())->get();
    }
}