<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test updating user profile data.
     */
    public function test_user_can_update_profile_details(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'username' => 'original_user',
            'phone_number' => '08123456789',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/v1/profile', [
            'name' => 'Updated Modern Name',
            'username' => 'updated_username',
            'phone_number' => '+6281987654321',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'name' => 'Updated Modern Name',
                        'username' => 'updated_username',
                        'phone_number' => '+6281987654321',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Modern Name',
            'username' => 'updated_username',
        ]);
    }

    /**
     * Test user can upload avatar image via MediaLibrary.
     */
    public function test_user_can_upload_avatar_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg', 300, 300);

        $response = $this->postJson('/api/v1/profile/avatar', [
            'avatar' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'avatar_url',
                ],
            ]);

        $this->assertNotNull($user->fresh()->avatar_url);
    }
}
