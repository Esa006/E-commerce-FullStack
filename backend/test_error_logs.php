<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $count = DB::table('error_logs')->count();
    echo "✓ error_logs table exists!\n";
    echo "Total error logs: $count\n";
    
    // Test insert
    DB::table('error_logs')->insert([
        'message' => 'Test error log',
        'component' => 'Test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    echo "✓ Successfully inserted test record\n";
    
    // Clean up test
    DB::table('error_logs')->where('message', 'Test error log')->delete();
    echo "✓ Test record deleted\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
