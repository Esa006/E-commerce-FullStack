<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Exception;

class OrderController extends Controller
{
    /**
     * Place a new order with transaction and stock checks.
     */
    public function placeOrder(Request $request)
    {
        // 1. Validation
        $request->validate([
            'address'       => 'required|string',
            'city'          => 'required|string',
            'state'         => 'required|string',
            'zip_code'      => 'required|string',
            'country'       => 'required|string',
            'phone'         => 'required|string',
            'cart_items'    => 'required|array',
            'total_amount'  => 'required|numeric',
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized: Please Login'], 401);
        }

        try {
            // 2. Start Transaction
            // The closure automatically receives $request
            $order = DB::transaction(function () use ($request) {
                
                // A. Create Order Record
                $newOrder = Order::create([
                    'user_id'       => Auth::id(),
                    'address'       => $request->address, // Line 1
                    'address_line2' => $request->address_line2, 
                    'city'          => $request->city,
                    'state'         => $request->state,
                    'zip_code'      => $request->zip_code,
                    'country'       => $request->country,
                    'phone'         => $request->phone,
                    'total_amount'  => $request->total_amount,
                    'status'        => 'pending',
                ]);

                // B. Process Each Item
                foreach ($request->cart_items as $item) {
                    
                    // C. Find & Lock the Product
                    // We use lockForUpdate() to prevent race conditions (The "Monday Man" Logic)
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    if (!$product) {
                        throw new Exception("Product not found.");
                    }

                    // D. Stock Check Logic
                    if ($product->stock >= $item['quantity']) {
                        
                        // Decrease Stock
                        $product->stock = $product->stock - $item['quantity'];
                        $product->save();

                        // Create Order Item
                        OrderItem::create([
                            'order_id'   => $newOrder->id,
                            'product_id' => $product->id,
                            'quantity'   => $item['quantity'],
                            'price'      => $item['price'],
                        ]);

                    } else {
                        // E. STOP! Rollback Trigger
                        // If stock is insufficient, we throw an exception to rollback the transaction
                        throw new Exception("SORRY! '{$product->name}' is out of stock!"); 
                    }
                }

                return $newOrder; 
            });

            // Success Response
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'data'    => $order
            ], 201);

        } catch (Exception $e) {
            // 3. Catch Block
            // The transaction is automatically rolled back here.
            
            // 🟢 SMART LOGIC: If the error is about stock, send 409 (Conflict).
            // This tells React to show the "Out of Stock" popup.
            // For other errors, send 400 (Bad Request).
            $status = str_contains(strtolower($e->getMessage()), 'out of stock') ? 409 : 400;

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $status);
        }
    }

    /**
     * Fetch all orders for admin.
     */
    public function index() 
    {
        return Order::with(['user', 'orderItems'])
                    ->withCount('orderItems')
                    ->orderBy('created_at', 'desc')
                    ->get();
    }

    /**
     * Show detailed items for a specific order.
     * Use this for the "Order Details" page.
     */
    public function showOrderItems($id)
    {
        $order = Order::with(['orderItems.product', 'user'])
                      ->where('id', $id)
                      // Security: Ensure user owns the order (or is admin, logic depending on requirement)
                      // For now, simple check:
                      ->where('user_id', Auth::id()) 
                      ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,delivered' 
        ]);

        $order = Order::find($id);
        
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated to ' . $request->status
        ]);
    }
}