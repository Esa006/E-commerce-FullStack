<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /* ================= ROLE CONSTANTS ================= */
    public const ROLE_ADMIN = 'admin';
    public const ROLE_CUSTOMER = 'customer';

    /* ================= MASS ASSIGNMENT ================= */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
    ];

    /* ================= HIDDEN FIELDS ================= */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /* ================= TYPE CASTING ================= */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /* ================= DEFAULT VALUES ================= */
    protected $attributes = [
        'role' => self::ROLE_CUSTOMER,
    ];

    /* ================= HELPER METHODS ================= */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }
}
