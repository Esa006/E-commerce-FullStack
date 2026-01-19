<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix SSL certificate issue by disabling verification for local development
        \Illuminate\Support\Facades\Http::globalOptions([
            'verify' => false,
        ]);

        // Log queries longer than 50ms to help debug runtime performance
        \Illuminate\Support\Facades\DB::listen(function ($query) {
            if ($query->time > 50) {
                // Find the first file in the backtrace that isn't in the vendor folder
                $location = collect(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS))->first(function ($trace) {
                    return isset($trace['file']) && !str_contains($trace['file'], 'vendor');
                });
                
                $origin = $location ? " -> Called from: {$location['file']} : Line {$location['line']}" : '';
                
                \Illuminate\Support\Facades\Log::warning("Long Query Detected ({$query->time}ms): {$query->sql} {$origin}", $query->bindings);
            }
        });
    }
}
