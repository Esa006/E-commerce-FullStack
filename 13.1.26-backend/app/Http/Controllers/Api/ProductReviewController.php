<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductReview;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductReviewController extends Controller
{
    /**
     * Store a verified product review.
     */
    public function store(Request $request)
    {
        // 1. Validate Input
        // 🟢 SMART: Make order_id optional, we will try to find it
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'comment' => 'nullable|string|max:1000', // Fallback from React
        ]);

        $user = Auth::user();
        $reviewContent = $request->review ?? $request->comment;
        $orderId = $request->order_id;

        // 2. Security & Verification Checks

        // A. If order_id is missing, find the latest delivered order for this product
        if (!$orderId) {
            $latestOrder = Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->whereHas('orderItems', function($q) use ($request) {
                    $q->where('product_id', $request->product_id);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$latestOrder) {
                return response()->json([
                    'message' => 'Verified Purchase Required: You can only review products you have bought and which have been delivered.'
                ], 403);
            }

            $orderId = $latestOrder->id;
        }

        // B. Verify Order Ownership and Status (Double check if provided)
        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Unauthorized or Order not found.'], 403);
        }

        if ($order->status !== 'delivered') {
            return response()->json(['message' => 'You can only rate delivered items.'], 400);
        }

        // C. Verify Product was purchased in this Order
        $purchased = DB::table('order_items')
            ->where('order_id', $orderId)
            ->where('product_id', $request->product_id)
            ->exists();

        if (!$purchased) {
            return response()->json(['message' => 'This product is not in your order.'], 400);
        }

        // D. Verify Unique Review (One review per product per order)
        $exists = ProductReview::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('order_id', $orderId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already rated this product for this order.'], 409);
        }

        // 3. Save Review & Update Aggregates Atomically
        try {
            DB::transaction(function () use ($request, $user, $orderId, $reviewContent) {
                // Create Review
                ProductReview::create([
                    'user_id' => $user->id,
                    'product_id' => $request->product_id,
                    'order_id' => $orderId,
                    'rating' => $request->rating,
                    'review' => $reviewContent,
                ]);

                // Recalculate Aggregates
                $productId = $request->product_id;
                $avg = ProductReview::where('product_id', $productId)->avg('rating');
                $count = ProductReview::where('product_id', $productId)->count();

                // Update Product
                Product::where('id', $productId)->update([
                    'rating_avg' => round($avg, 1),
                    'rating_count' => $count,
                    'rating' => (int) round($avg) // 🟢 Support legacy integer rating column
                ]);
            });

            return response()->json(['message' => 'Review submitted successfully!'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save review.', 'error' => $e->getMessage()], 500);
        }
    }
}
