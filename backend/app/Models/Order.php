<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

protected $fillable = [
    'user_id',
    'total_amount',
    'address',
    'phone',
    'name',      // for guest
    'email',     // for guest
    'status'
];

protected $attributes = [
    'status' => 'pending',
];
    /*
     * Order belongs to a User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Order has many Order Items
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * (Optional) Calculate total from items
     */
    public function getCalculatedTotalAttribute()
    {
        return $this->orderItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });
    }
}
