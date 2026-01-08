<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AddressTest extends TestCase
{
    // use RefreshDatabase; // assuming we can reset DB or user wants to persist. Using typical test practice.
    // actually, let's not use RefreshDatabase if user environment is not set up for it to be ephemeral, 
    // but usually in Laravel tests we do. I'll omit it for safety so I don't wipe their dev DB if they are using the same config.
    // Instead I will clean up created records.

    public function test_user_can_add_address()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->postJson('/api/addresses', [
            'full_name' => 'John Doe',
            'address_line1' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'zip_code' => '10001',
            'country' => 'USA',
            'phone' => '555-1234',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('addresses', ['user_id' => $user->id, 'city' => 'New York']);
        
        $user->delete(); // cleanup
    }

    public function test_user_can_list_addresses()
    {
        $user = User::factory()->create();
        Address::factory()->create(['user_id' => $user->id]);
        
        $response = $this->actingAs($user)->getJson('/api/addresses');
        
        $response->assertStatus(200)
                 ->assertJsonCount(1);
        
        $user->delete();
    }
}
