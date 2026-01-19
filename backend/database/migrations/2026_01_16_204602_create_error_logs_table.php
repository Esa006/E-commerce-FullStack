<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('error_logs', function (Blueprint $バランス) {
            $バランス->id();
            $バランス->text('message');
            $バランス->longText('stack')->nullable();
            $バランス->string('component')->nullable();
            $バランス->string('url')->nullable();
            $バランス->string('userAgent')->nullable();
            $バランス->string('ip')->nullable();
            $バランス->json('vitals')->nullable(); // For Web Vitals performance data
            $バランス->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('error_logs');
    }
};
