<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login with valid email.
     */
    public function test_user_can_login_with_valid_email(): void
    {
        $user = User::factory()->create([
            'email' => 'testlogin@learnflow.io',
            'username' => 'testlogin_user',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'identifier' => 'testlogin@learnflow.io',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'email' => 'testlogin@learnflow.io',
                    ],
                ],
            ])
            ->assertJsonStructure([
                'data' => [
                    'user',
                    'roles',
                    'permissions',
                    'token',
                ],
            ]);
    }

    /**
     * Test login with valid username.
     */
    public function test_user_can_login_with_valid_username(): void
    {
        $user = User::factory()->create([
            'email' => 'username_test@learnflow.io',
            'username' => 'custom_username',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'identifier' => 'custom_username',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'username' => 'custom_username',
                    ],
                ],
            ]);
    }

    /**
     * Test login with invalid password returns 422.
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'wrongpass@learnflow.io',
            'password' => Hash::make('correct_password'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'identifier' => 'wrongpass@learnflow.io',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test /api/v1/auth/me returns current user profile and roles.
     */
    public function test_authenticated_user_can_fetch_me_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'email' => $user->email,
                    ],
                ],
            ]);
    }

    /**
     * Test logout terminates session.
     */
    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Berhasil keluar dari sistem',
            ]);
    }
}
