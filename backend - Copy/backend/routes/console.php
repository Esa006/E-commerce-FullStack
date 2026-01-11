<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
// <?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\ProductController;

// // Auth APIs
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// // Product API
// Route::get('/products', [ProductController::class, 'index']);
