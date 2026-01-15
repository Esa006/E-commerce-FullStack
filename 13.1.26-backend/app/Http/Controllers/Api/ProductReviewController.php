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
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        // 2. Security Checks
        
        // A. Verify Order Ownership
        $order = Order::where('id', $request->order_id)
            ->where('user_id', $user->id)
            ->with('orderItems')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Unauthorized or Order not found.'], 403);
        }

        // B. Verify Order is Delivered
        if ($order->status !== 'delivered') {
            return response()->json(['message' => 'You can only rate delivered items.'], 400);
        }

        // C. Verify Product was purchased in this Order
        $purchased = $order->orderItems->contains('product_id', $request->product_id);

        if (!$purchased) {
            return response()->json(['message' => 'This product is not in your order.'], 400);
        }

        // D. Verify Unique Review (One review per product per order)
        $exists = ProductReview::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('order_id', $request->order_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already rated this product for this order.'], 409);
        }

        // 3. Save Review & Update Aggregates Atomically
        try {
            DB::transaction(function () use ($request, $user) {
                // Create Review
                ProductReview::create([
                    'user_id' => $user->id,
                    'product_id' => $request->product_id,
                    'order_id' => $request->order_id,
                    'rating' => $request->rating,
                    'review' => $request->review,
                ]);

                // Recalculate Aggregates
                $productId = $request->product_id;
                $avg = ProductReview::where('product_id', $productId)->avg('rating');
                $count = ProductReview::where('product_id', $productId)->count();

                // Update Product
                Product::where('id', $productId)->update([
                    'rating_avg' => round($avg, 1),
                    'rating_count' => $count
                ]);
            });

            return response()->json(['message' => 'Review submitted successfully!'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save review.', 'error' => $e->getMessage()], 500);
        }
    }
}
