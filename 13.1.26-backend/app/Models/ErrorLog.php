<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ErrorLog extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'message',
        'stack',
        'component',
        'url',
        'userAgent',
        'ip',
        'vitals',
    ];

    protected $casts = [
        'vitals' => 'array',
    ];
}
