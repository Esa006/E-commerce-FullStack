<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

echo "Cainfo: " . ini_get('curl.cainfo') . "\n";
echo "Openssl: " . ini_get('openssl.cafile') . "\n";
echo "File Exists: " . (file_exists(ini_get('curl.cainfo')) ? 'Yes' : 'No') . "\n";

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
try {
    $response = Illuminate\Support\Facades\Http::get('https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler.min.css');
    echo "Status: " . $response->status();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
