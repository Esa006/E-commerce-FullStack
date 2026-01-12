<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'address',
        'address_line2',
        'city',
        'state',
        'zip_code',
        'country',
        'phone',
        'name',
        'email',
        'status',
        'tracking_number',
        'expected_delivery_date'
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
