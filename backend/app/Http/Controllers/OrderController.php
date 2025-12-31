<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function placeOrder(Request $request)
    {
        // 1. Auth Guard
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized: Please Login'], 401);
        }

        // 2. Simple Validation
        $request->validate([
            'address'      => 'required|string',
            'phone'        => 'required',
            'cart_items'   => 'required|array',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 3. Create Order
                $order = Order::create([
                    'user_id'      => Auth::id(),
                    'total_amount' => $request->total_amount,
                    'address'      => $request->address,
                    'phone'        => $request->phone,
                    'status'       => 'pending',
                ]);

                // 4. Smart Item Logic
                foreach ($request->cart_items as $item) {
                    $pid = (int) $item['product_id'];
                    $product = Product::find($pid);

                    // ஐடி டேட்டாபேஸில் இல்லையென்றால் இங்கே பிழை பிடிபடும்
                    if (!$product) {
                        throw new \Exception("Product ID {$pid} உங்கள் Database-இல் இல்லை! தயவுசெய்து products table-ஐச் சரிபார்க்கவும்.");
                    }

                    OrderItem::create([
                        'order_id'   => $order->id,
                        'product_id' => $product->id,
                        'price'      => $item['price'],
                        'quantity'   => $item['quantity'],
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'ஆர்டர் வெற்றிகரமாகச் சேமிக்கப்பட்டது!',
                    'order_id' => $order->id
                ], 201);
            });
        } catch (\Exception $e) {
            // இங்கே பிழைச் செய்தி மிகத் தெளிவாகத் தெரியும்
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}