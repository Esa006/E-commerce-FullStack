<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // உங்கள் ProductSeeder-ஐ இங்கே அழைக்கிறோம்
        $this->call([
            ProductSeeder::class,
        ]);
    }
}