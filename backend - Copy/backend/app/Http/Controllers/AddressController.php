<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;

class AddressController extends Controller
{
    /**
     * Get user's saved addresses from previous orders
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get unique addresses from user's previous orders
        $addresses = Order::where('user_id', $user->id)
            ->whereNotNull('address')
            ->select('address', 'address_line2', 'city', 'state', 'zip_code', 'country', 'phone')
            ->get()
            ->unique(function ($order) {
                // Create a unique key based on address fields
                return $order->address . '|' .
                    $order->city . '|' .
                    $order->state . '|' .
                    $order->zip_code . '|' .
                    $order->country;
            })
            ->values()
            ->map(function ($order, $index) use ($user) {
                return [
                    'id' => $index + 1, // Generate a temporary ID
                    'name' => $user->name,
                    'address' => $order->address,
                    'address_line2' => $order->address_line2,
                    'city' => $order->city,
                    'state' => $order->state,
                    'zip_code' => $order->zip_code,
                    'country' => $order->country,
                    'phone' => $order->phone,
                ];
            });

        return response()->json([
            'success' => true,
            'addresses' => $addresses
        ]);
    }
}
