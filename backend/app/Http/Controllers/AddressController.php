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
     * @return \Illuminate\Http\JsonResponse
     */
    private function getAddresses($user)
    {
        // 1. Get profile address
        $addresses = collect();

        if (!empty($user->address)) {
            $addresses->push([
                'id' => 'profile', // Special ID for profile address
                'name' => $user->name,
                'address' => $user->address,
                'address_line2' => $user->address_line2,
                'city' => $user->city,
                'state' => $user->state,
                'zip_code' => $user->zip_code,
                'country' => $user->country,
                'phone' => $user->phone,
            ]);
        }

        // 2. Get historical addresses from orders
        $orderAddresses = Order::where('user_id', $user->id)
            ->whereNotNull('address')
            ->select('address', 'address_line2', 'city', 'state', 'zip_code', 'country', 'phone')
            ->orderBy('created_at', 'desc') // Latest first
            ->get()
            ->unique(function ($order) {
                return $order->address . '|' . $order->city . '|' . $order->zip_code;
            });

        // 3. Merge and formatting
        foreach ($orderAddresses as $order) {
            // Avoid duplicates with profile address
            if (
                $order->address === $user->address &&
                $order->zip_code === $user->zip_code
            ) {
                continue;
            }

            $addresses->push([
                'id' => 'ord_' . md5($order->address . $order->created_at), // Generate unique ID
                'name' => $user->name,
                'address' => $order->address,
                'address_line2' => $order->address_line2,
                'city' => $order->city,
                'state' => $order->state,
                'zip_code' => $order->zip_code,
                'country' => $order->country,
                'phone' => $order->phone,
            ]);
        }

        // Return values
        return $addresses->values();
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $addresses = $this->getAddresses($user);

        return response()->json([
            'success' => true,
            'addresses' => $addresses
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $addresses = $this->getAddresses($user);
        $address = $addresses->firstWhere('id', (int) $id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return response()->json([
            'success' => true,
            'address' => $address
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'phone' => 'required|regex:/^[0-9]{10,15}$/',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Update the User's profile address
        $user->update([
            'address' => $request->address,
            'address_line2' => $request->address_line2,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Address saved successfully',
            'address' => $request->all()
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'phone' => 'required|regex:/^[0-9]{10,15}$/',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Since addresses are historical (from orders) and we don't have an address book table,
        // we update the User's default profile address so it's used for future orders.
        $user->update([
            'address' => $request->address,
            'address_line2' => $request->address_line2,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully (Profile updated)',
            'address' => $request->all()
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // 🟢 Case 1: Profile Address
        if ($id === 'profile') {
            $user->update([
                'address' => null,
                'address_line2' => null,
                'city' => null,
                'state' => null,
                'zip_code' => null,
                'country' => null,
                'phone' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile address cleared successfully.'
            ]);
        }

        // 🔴 Case 2: Historical Order Address
        if (str_starts_with($id, 'ord_')) {
            return response()->json([
                'success' => false,
                'message' => 'Historical address cannot be deleted. These records are kept for order tracking and tax records.'
            ], 403);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid address ID.'
        ], 400);
    }
}
