<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\ErrorLog;

class ErrorReportController extends Controller
{
    /**
     * Handle incoming error reports from the frontend.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function report(Request $request)
    {
        // 1. Validate the payload (Basic structure check)
        $data = $request->validate([
            'message'    => 'required|string',
            'stack'      => 'nullable|string',
            'component'  => 'nullable|string', // e.g., 'React ErrorBoundary'
            'url'        => 'nullable|string',
            'userAgent'  => 'nullable|string',
            'vitals'     => 'nullable|array', // Performance data
        ]);

        // 2. Add server-side metadata
        $ip = $request->ip();
        
        // 3. Save to Database for Admin Dashboard
        ErrorLog::create(array_merge($data, [
            'ip' => $ip
        ]));

        // 4. Log to the primary error channel (Daily) for backup/external tools
        Log::channel('daily')->error('Frontend Error Report', array_merge($data, [
            'ip'         => $ip,
            'timestamp'  => now()->toDateTimeString(),
            'environment'=> config('app.env'),
        ]));

        // 5. Return success (Quietly)
        return response()->json([
            'success' => true,
            'message' => 'Report received'
        ]);
    }

    /**
     * Fetch all error logs (Admin Only)
     */
    public function index()
    {
        $logs = ErrorLog::orderBy('created_at', 'desc')->paginate(50);
        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
