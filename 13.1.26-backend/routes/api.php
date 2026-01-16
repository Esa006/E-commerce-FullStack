<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ErrorReportController;

/*
|--------------------------------------------------------------------------
| 🟢 PUBLIC ROUTES (No Login Required)
|--------------------------------------------------------------------------
*/
Route::post('/error-report', [ErrorReportController::class, 'report'])->middleware('throttle:5,1');
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/new-arrivals', [ProductController::class, 'getNewArrivals']);
Route::get('/products/bestsellers', [ProductController::class, 'getBestsellers']);
Route::get('/products/categories', [ProductController::class, 'getCategories']); // New Route
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/products/brands', [ProductController::class, 'getBrands']); // New Route
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/cart/validate', [CartController::class, 'validateCart']);

// Tracking (Public)
Route::post('/orders/track', [OrderController::class, 'track']);
Route::match(['get', 'post'], '/track-order', [OrderController::class, 'track']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/login', [AdminController::class, 'login']);

/*
|--------------------------------------------------------------------------
| 🔴 PROTECTED ROUTES (Login Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::match(['get', 'post', 'put', 'patch'], '/user', function (Request $request) {
        if ($request->isMethod('get')) {
            return $request->user();
        }
        return app(AuthController::class)->updateProfile($request);
    });
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Addresses
    Route::match(['get', 'post', 'put', 'patch'], '/addresses', function (Request $request) {
        if ($request->isMethod('get')) {
            return app(AddressController::class)->index($request);
        }
        return app(AddressController::class)->store($request);
    });
    Route::get('/addresses/{id}', [AddressController::class, 'show']);
    Route::match(['put', 'patch'], '/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Validated Product Reviews
    Route::post('/product-review', [App\Http\Controllers\Api\ProductReviewController::class, 'store']);

    // Cart
    Route::prefix('cart')->group(function () {
        Route::post('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'addToCart']);
        Route::put('/{id}', [CartController::class, 'updateQuantity']);
        Route::delete('/{id}', [CartController::class, 'removeFromCart']);
    });

    // ORDERS
    // MOVED INSIDE (Correct Position)
    Route::post('/orders', [OrderController::class, 'placeOrder']);
    Route::get('/orders', [OrderController::class, 'myOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'showOrderItems']);
    Route::get('/orders/{id}/items', [OrderController::class, 'showOrderItems']);

    // Products Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // MOVED INSIDE (Secure)
    Route::put('/admin/products/{id}/stock', [ProductController::class, 'updateStock']);

    // Admin - Customers & Orders
    Route::put('/admin/customers/{id}', [AdminController::class, 'updateRole']);
    Route::get('/admin/customers', [AdminController::class, 'getCustomers']);
    Route::delete('/admin/customers/{id}', [AdminController::class, 'deleteCustomer']);
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    
    // Error Logs (Production Monitoring)
    Route::get('/admin/error-logs', [ErrorReportController::class, 'index']);
});