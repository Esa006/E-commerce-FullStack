<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Intercept "OPTIONS" requests immediately
        // We return a 200 OK without bothering the controller
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            // 2. For normal requests (POST, GET), continue as usual
            $response = $next($request);
        }

        // 3. Attach the permission stamps (headers)
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }}