<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

      
        $cart = Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $request->product_id],
            ['quantity' => \DB::raw("quantity + $request->quantity")]
        );

        return response()->json(['message' => 'Product added to cart', 'data' => $cart]);
    }

  
    public function updateQuantity(Request $request, $id) {
        $cart = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart quantity updated']);
    }

 
    public function removeFromCart($id) {
        Cart::where('id', $id)->where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Product removed from cart']);
    }
}