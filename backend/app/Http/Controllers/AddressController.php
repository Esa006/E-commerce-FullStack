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
        return Order::where('user_id', $user->id)
            ->whereNotNull('address')
            ->select('address', 'address_line2', 'city', 'state', 'zip_code', 'country', 'phone')
            ->get()
            ->unique(function ($order) {
                return $order->address . '|' . $order->city . '|' . $order->state . '|' . $order->zip_code . '|' . $order->country;
            })
            ->values()
            ->map(function ($order, $index) use ($user) {
                return [
                    'id' => $index + 1,
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
            'phone' => 'required|string',
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
            'phone' => 'required|string',
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
}
