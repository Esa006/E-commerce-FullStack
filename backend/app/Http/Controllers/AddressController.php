<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->addresses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();

        // If this is the first address or marked as default, handle that logic
        if ($request->is_default) {
            $user->addresses()->update(['is_default' => false]);
        } else if ($user->addresses()->count() === 0) {
            // make first address default automatically
            $request->merge(['is_default' => true]);
        }

        $address = $user->addresses()->create($request->all());

        return response()->json($address, 201);
    }

    public function update(Request $request, Address $address)
    {
        // specific policy check normally here, simplified for now:
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'address_line1' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'state' => 'sometimes|required|string|max:255',
            'zip_code' => 'sometimes|required|string|max:255',
            'country' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($request->has('is_default') && $request->is_default) {
            Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($request->all());

        return response()->json($address);
    }

    public function destroy(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }

    public function setDefault(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Auth::user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json($address);
    }
}
