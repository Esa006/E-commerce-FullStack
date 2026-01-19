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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'rating_avg')) {
                $table->float('rating_avg')->default(0)->after('rating');
            }
            if (!Schema::hasColumn('products', 'rating_count')) {
                $table->integer('rating_count')->default(0)->after('rating_avg');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['rating_avg', 'rating_count']);
        });
    }
};
