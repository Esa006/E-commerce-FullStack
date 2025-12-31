<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    // 🛡️ மார்ஸ் அசைன்மென்ட் செய்ய வேண்டிய அனைத்து காலம்களையும் இங்கே சேர்க்கவும்
    protected $fillable = [
        'id',             // Tinker மூலம் ID செட் செய்ய இது அவசியம்
        'name', 
        'description', 
        'price', 
        'image',
        'category',       
        'subCategory',    // ⬅️ இது விடுபட்டிருந்தது
        'sizes',          // ⬅️ இது விடுபட்டிருந்தது
        'date',           // ⬅️ இது விடுபட்டிருந்தது
        'bestseller'      // ⬅️ இது விடுபட்டிருந்தது
    ];

    // JSON ஆக வரும் 'sizes' டேட்டாவை தானாக Array-ஆக மாற்ற இது உதவும்
    protected $casts = [
        'sizes' => 'array',
        'date'  => 'datetime'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}