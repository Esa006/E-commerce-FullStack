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
            $order = DB::transaction(function () use ($request, $orderEmail) {
                // Initialize server-side total
                $totalAmount = 0;
                $processedItems = [];

                // Pre-process items to calculate total and check stock
                foreach ($request->cart_items as $item) {
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    if (!$product) {
                        throw new Exception("Product ID {$item['product_id']} not found.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new Exception("SORRY! '{$product->name}' is out of stock!");
                    }

                    // 🟢 SECURE LOGIC: Use Database Price, not Request Price
                    $itemPrice = $product->price;
                    $totalAmount += ($itemPrice * $item['quantity']);

                    $processedItems[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'price' => $itemPrice
                    ];
                }

                // 🟢 Add standard shipping fee (matching frontend)
                $totalAmount += 10;

                // A. Create Order Record
                $newOrder = Order::create([
                    'user_id' => Auth::id(),
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $orderEmail,
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'address' => $request->address,
                    'address_line2' => $request->address_line2,
                    'city' => $request->city,
                    'state' => $request->state,
                    'zip_code' => $request->zip_code,
                    'country' => $request->country,
                    'phone' => $request->phone,
                    'total_amount' => $totalAmount, // 🟢 Recalculated Total
                    'payment_method' => $request->payment_method,
                    'status' => 'pending',
                ]);

                // B. Save items and update stock
                foreach ($processedItems as $pItem) {
                    $product = $pItem['product'];
                    
                    // Decrease Stock
                    $product->stock = $product->stock - $pItem['quantity'];
                    $product->save();

                    // Create Order Item
                    OrderItem::create([
                        'order_id' => $newOrder->id,
                        'product_id' => $product->id,
                        'quantity' => $pItem['quantity'],
                        'price' => $pItem['price'], // 🟢 Database-sourced price
                    ]);
                }

                // 🟢 CLEAR CART: Remove items from database after order success
                if (Auth::check()) {
                    \App\Models\Cart::where('user_id', Auth::id())->delete();
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
            'status' => 'required|in:confirmed,shipped,out_for_delivery,delivered,cancelled'
        ]);

        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        // VALID STATE TRANSITIONS
        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['shipped', 'cancelled'],
            'shipped' => ['out_for_delivery', 'cancelled'],
            'out_for_delivery' => ['delivered'],
        ];

        if (
            !isset($allowedTransitions[$order->status]) ||
            !in_array($request->status, $allowedTransitions[$order->status])
        ) {
            return response()->json([
                'success' => false,
                'message' => "Invalid transition from {$order->status} to {$request->status}"
            ], 422);
        }

        DB::transaction(function () use ($request, $order) {
            // 🟢 STOCK RESTORATION LOGIC
            if ($request->status === 'cancelled') {
                foreach ($order->orderItems as $item) {
                    if ($item->product) {
                        $item->product->increment('stock', $item->quantity);
                    }
                }
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
        });

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