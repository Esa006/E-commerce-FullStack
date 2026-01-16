<?php

use App\Models\Product;
use Illuminate\Http\Request;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

function testFilter($cat) {
    echo "Testing Category: $cat\n";
    $request = new Request(['category' => $cat]);
    $controller = new \App\Http\Controllers\ProductController();
    $response = $controller->index($request);
    $data = json_decode($response->getContent(), true);
    
    if (isset($data['data'])) {
        echo "Found " . count($data['data']) . " products.\n";
        foreach (array_slice($data['data'], 0, 3) as $p) {
            echo "- " . $p['name'] . " (" . $p['category'] . ")\n";
        }
    } else {
        echo "Error: No data returned.\n";
    }
    echo "-------------------\n";
}

testFilter('Women');
testFilter('Men');
testFilter('Kids');
