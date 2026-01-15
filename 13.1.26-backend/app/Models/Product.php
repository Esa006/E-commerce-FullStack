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
        'brand',
        'description',
        'price',
        'image',
        'category',
        'subCategory',
        'sizes',
        'date',
        'bestseller',
        'stock',
        'rating',
        'rating_avg',
        'rating_count',
        'product_details'
    ];

    protected $casts = [
        'bestseller' => 'boolean',
        'price' => 'float',
        'stock' => 'integer',
        'date' => 'date',
        // 'image' => 'array',  <-- REMOVED because Accessor handles decoding
        'rating' => 'integer',
        'rating_avg' => 'float',
        'rating_count' => 'integer',
        'product_details' => 'array'
    ];

    public function setImageAttribute($value)
    {
        $attribute_name = "image";
        $disk = "public";
        $destination_path = "products";

        // FIX: If passing an array of strings (existing files from seeder), 
        // just JSON encode them directly and skip the upload logic-check.
        if (is_array($value) && count($value) > 0 && is_string($value[0]) && !str_starts_with($value[0], 'data:')) {
            $this->attributes[$attribute_name] = json_encode($value);
            return;
        }

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

    public function getImageAttribute($value)
    {
        if (empty($value)) {
            return [];
        }

        // Try to decode assuming it's JSON
        $images = json_decode($value, true);

        // If decode failed or isn't an array, treat raw value as a single image path
        if (!is_array($images)) {
            // Clean potentially double-quoted string from DB (e.g. '"foo.png"')
            $cleanValue = trim($value, '"\'');
            $images = [$cleanValue];
        }

        return array_map(function ($img) {
            // Return if already a full URL
            if (str_starts_with($img, 'http')) {
                return $img;
            }

            // FORCE: Return the asset URL directly. 
            return asset('storage/products/' . $img);
        }, $images);
    }

}