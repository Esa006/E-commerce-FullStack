<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Product extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'category',
        'subCategory',
        'sizes',
        'date',
        'bestseller',
        'stock'
    ];

    protected $casts = [
        'bestseller' => 'boolean',
        'price' => 'float',
        'stock' => 'integer',
        'date' => 'date',
        'stock' => 'integer',
        'date' => 'date',
        'image' => 'array'
    ];

    public function setImageAttribute($value)
    {
        $attribute_name = "image";
        $disk = "public";
        $destination_path = "products";

        $this->uploadMultipleFilesToDisk($value, $attribute_name, $disk, $destination_path);
    }

    // 🟢 NEW: Check if stock is low (e.g., 5 or less)
    public function isLowStock($threshold = 5)
    {
        return $this->stock > 0 && $this->stock <= $threshold;
    }

    // 🟢 NEW: Append stock status for React API
    protected $appends = ['stock_status'];

    public function getStockStatusAttribute()
    {
        if ($this->stock <= 0)
            return 'out_of_stock';
        if ($this->isLowStock())
            return 'low_stock';
        return 'in_stock';
    }

}