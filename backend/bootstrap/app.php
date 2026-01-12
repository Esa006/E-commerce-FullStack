<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Fix SSL certificate issue in local development
$cacert = __DIR__ . '/../cacert.pem';
if (file_exists($cacert)) {
    $cacert = realpath($cacert);
    putenv("CURL_CA_BUNDLE=$cacert");
    putenv("SSL_CERT_FILE=$cacert");
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\App\Http\Middleware\Cors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
