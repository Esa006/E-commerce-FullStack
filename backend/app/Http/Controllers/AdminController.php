<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Admin Login
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        if ($user->role !== User::ROLE_ADMIN) {
            return response()->json([
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }

        $token = $user->createToken('AdminToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user
        ], 200);
    }

    /**
     * Get all customers
     */
    public function getCustomers()
    {
        $customers = User::where('role', 'customer')->get();

        return response()->json([
            'customers' => $customers
        ], 200);
    }

    /**
     * Update customer role
     */
 public function updateCustomer(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'role' => 'required|in:admin,customer,user', // 'user' என்பதையும் சேர்த்துக் கொள்ளுங்கள்
        'phone' => 'nullable|string',
        'address' => 'nullable|string',
    ]);

    $user = User::findOrFail($id);

    // தன்னைத்தானே மாற்றிக்கொள்வதைத் தடுத்தல்
    if ($user->id === auth()->id()) {
        return response()->json(['message' => 'Cannot edit your own role'], 403);
    }

    $user->update($request->only('name', 'role', 'phone', 'address'));

    return response()->json(['message' => 'Customer updated successfully', 'user' => $user]);
}
public function deleteCustomer($id)
{
    $user = User::findOrFail($id);

    if ($user->id === auth()->id()) {
        return response()->json(['message' => 'Cannot delete yourself'], 403);
    }

    $user->delete();

    return response()->json(['message' => 'Customer deleted successfully']);
}
}