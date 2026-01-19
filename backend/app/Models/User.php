<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable, \Backpack\CRUD\app\Models\Traits\CrudTrait;

    const ROLE_ADMIN = 'admin';
    const ROLE_CUSTOMER = 'customer';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'address_line2',
        'city',
        'state',
        'zip_code',
        'country',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];
}
