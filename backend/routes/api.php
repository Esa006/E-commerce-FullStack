<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AddressController;

/*
|--------------------------------------------------------------------------
| 🟢 PUBLIC ROUTES 
|--------------------------------------------------------------------------
*/
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/login', [AdminController::class, 'login']);

/*
|--------------------------------------------------------------------------
| 🔴 PROTECTED ROUTES 
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {


    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);



    Route::prefix('cart')->group(function () {
        // 🟢 1. SPECIFIC routes must come FIRST
        // Fix: Remove '/cart' (prefix handles it) and move to top
        Route::post('/validate', [CartController::class, 'validateCart']);

        // 2. General routes
        Route::post('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'addToCart']);

        // 🔴 3. WILDCARD routes must come LAST
        // Because '{id}' matches ANYTHING (including the word "validate")
        Route::put('/{id}', [CartController::class, 'updateQuantity']);
        Route::delete('/{id}', [CartController::class, 'removeFromCart']);
    });

    // ORDERS
    Route::post('/orders', [OrderController::class, 'placeOrder']);
    Route::get('/orders/{id}/items', [OrderController::class, 'showOrderItems']);

    // ADDRESSES
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);
    Route::put('/addresses/{address}/default', [AddressController::class, 'setDefault']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY ROUTES
    |--------------------------------------------------------------------------
    */
    // Admin - Products Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    // Admin - Customers & Orders
    Route::put('/admin/customers/{id}', [AdminController::class, 'updateRole']);
    Route::get('/admin/customers', [AdminController::class, 'getCustomers']);
    Route::delete('/admin/customers/{id}', [AdminController::class, 'deleteCustomer']);
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
});
Route::put('/admin/products/{id}/stock', [ProductController::class, 'updateStock']);