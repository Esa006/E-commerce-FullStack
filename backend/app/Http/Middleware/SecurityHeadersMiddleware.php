<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // 1. Force HTTPS (HSTS)
        // 31536000 seconds = 1 year
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // 2. Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // 3. Prevent Clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // 4. Basic Permissions Policy (Opt-out of intrusive features)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');

        // 5. XSS Protection (Legacy but still useful)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // 6. Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return $response;
    }
}
