<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Str;
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
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'phone' => 'required|string',
            'cart_items' => 'required|array',
            'total_amount' => 'required|numeric',
            // Email is optional for logged-in users (fallback to auth), required for guests
            'email' => 'nullable|email',
        ]);

        if (!Auth::check() && !$request->email) {
            return response()->json(['message' => 'Email is required for guest checkout.'], 422);
        }

        // Determine Email: Request > Auth User
        $orderEmail = $request->email ?? optional(Auth::user())->email;

        try {
            // 2. Start Transaction
            // The closure automatically receives $request
            $order = DB::transaction(function () use ($request, $orderEmail) {

                // A. Create Order Record
                $newOrder = Order::create([
                    'user_id' => Auth::id(), // Nullable for guests
                    'email' => $orderEmail,  // 🟢 Snapshot Email
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)), // 🟢 Auto-generate Order ID
                    'address' => $request->address, // Line 1
                    'address_line2' => $request->address_line2,
                    'city' => $request->city,
                    'state' => $request->state,
                    'zip_code' => $request->zip_code,
                    'country' => $request->country,
                    'phone' => $request->phone,
                    'total_amount' => $request->total_amount,
                    'payment_method' => $request->payment_method,
                    'status' => 'pending',
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
                            'order_id' => $newOrder->id,
                            'product_id' => $product->id,
                            'quantity' => $item['quantity'],
                            'price' => $item['price'],
                        ]);

                    } else {
                        // E. STOP! Rollback Trigger
                        // If stock is insufficient, we throw an exception to rollback the transaction
                        throw new Exception("SORRY! '{$product->name}' is out of stock!");
                    }
                }

                return $newOrder->load('orderItems.product');
            });

            // Success Response
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'data' => $order
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
            ->where(function ($q) {
                $q->where('user_id', Auth::id())
                    ->orWhere('email', Auth::user()->email);
            })
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
            'status' => 'required|in:confirmed,shipped,out_for_delivery,delivered'
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        // VALID STATE TRANSITIONS
        $allowedTransitions = [
            'pending' => ['confirmed'],
            'confirmed' => ['shipped'],
            'shipped' => ['out_for_delivery'],
            'out_for_delivery' => ['delivered'],
        ];

        if (
            !isset($allowedTransitions[$order->status]) ||
            !in_array($request->status, $allowedTransitions[$order->status])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid order status transition'
            ], 422);
        }

        // APPLY STATUS + METADATA
        $order->status = $request->status;

        if ($request->status === 'confirmed') {
            $order->confirmed_at = now();
        }

        if ($request->status === 'shipped') {
            $order->tracking_number = $order->tracking_number
                ?? 'TRK-' . strtoupper(Str::random(10));
            $order->shipped_at = now();
            $order->expected_delivery_date = now()->addDays(4);
        }

        if ($request->status === 'delivered') {
            $order->delivered_at = now();
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'status' => $order->status
        ]);
    }
    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email'
        ]);

        $order = Order::where('order_number', $request->order_number)
            ->where('email', $request->email) // 🟢 Check directly against Order Email
            ->with('orderItems.product')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'order_number' => $order->order_number,
            'status' => $order->status,
            'tracking_number' => $order->tracking_number,
            'expected_delivery_date' => $order->expected_delivery_date,
            'total_amount' => $order->total_amount,
            'created_at' => $order->created_at,
            'address' => [
                'line1' => $order->address,
                'line2' => $order->address_line2,
                'city' => $order->city,
                'state' => $order->state,
                'zip' => $order->zip_code,
                'country' => $order->country,
            ],
            'timeline' => [
                'confirmed_at' => $order->confirmed_at,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ],
            'items' => $order->orderItems
        ]);
    }

    /**
     * Get authenticated user's orders
     */
    public function myOrders(Request $request)
    {
        // 🟢 SMART LOGIC: Show orders linked by ID OR by Email
        // This allows users to see orders they placed as "Guest" if the email matches.
        return Order::where(function ($q) {
            $q->where('user_id', Auth::id())
                ->orWhere('email', Auth::user()->email);
        })
            ->with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}