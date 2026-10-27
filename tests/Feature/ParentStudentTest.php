<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ParentStudentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'parent', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
    }

    /**
     * Test parent can link student via student_code.
     */
    public function test_parent_can_link_student_using_student_code(): void
    {
        $parent = User::factory()->create();
        $parent->assignRole('parent');

        $student = User::factory()->create([
            'student_code' => 'NIS-2026-999',
            'name' => 'Bintang Pratama',
        ]);
        $student->assignRole('student');

        Sanctum::actingAs($parent);

        $response = $this->postJson('/api/v1/parent/link-student', [
            'student_code' => 'NIS-2026-999',
            'relationship' => 'father',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'student' => [
                        'student_code' => 'NIS-2026-999',
                    ],
                    'relationship' => 'father',
                    'is_verified' => true,
                ],
            ]);

        $this->assertDatabaseHas('parent_students', [
            'parent_id' => $parent->id,
            'student_id' => $student->id,
            'relationship' => 'father',
        ]);
    }

    /**
     * Test parent can fetch list of linked wards.
     */
    public function test_parent_can_view_linked_wards(): void
    {
        $parent = User::factory()->create();
        $parent->assignRole('parent');

        $student = User::factory()->create([
            'student_code' => 'NIS-2026-888',
            'name' => 'Citra Lestari',
        ]);

        $parent->wards()->create([
            'student_id' => $student->id,
            'relationship' => 'mother',
            'is_verified' => true,
        ]);

        Sanctum::actingAs($parent);

        $response = $this->getJson('/api/v1/parent/wards');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'student_code' => 'NIS-2026-888',
                'relationship' => 'mother',
            ]);
    }
}
