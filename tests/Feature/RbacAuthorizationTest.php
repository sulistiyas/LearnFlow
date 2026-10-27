<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RbacAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'instructor', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
    }

    /**
     * Test student cannot access instructor exam creation endpoint (403 Forbidden).
     */
    public function test_student_role_cannot_access_instructor_exam_creation_endpoint(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/exams', [
            'title' => 'Ujian Tengah Semester',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test instructor can access exam creation endpoint (201 Created).
     */
    public function test_instructor_role_can_access_exam_creation_endpoint(): void
    {
        $instructor = User::factory()->create();
        $instructor->assignRole('instructor');

        Sanctum::actingAs($instructor);

        $response = $this->postJson('/api/v1/exams', [
            'title' => 'Ujian Akhir Semester Fisika Dasar',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Ujian Akhir Semester Fisika Dasar',
                ],
            ]);
    }

    /**
     * Test superadmin can assign and update roles of another user.
     */
    public function test_superadmin_can_assign_roles_to_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('superadmin');

        $targetUser = User::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/v1/admin/users/{$targetUser->id}/roles", [
            'roles' => ['instructor'],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'roles' => ['instructor'],
                ],
            ]);

        $this->assertTrue($targetUser->fresh()->hasRole('instructor'));
    }

    /**
     * Test regular student cannot access admin role assignment endpoint.
     */
    public function test_regular_user_cannot_assign_roles(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $targetUser = User::factory()->create();

        Sanctum::actingAs($student);

        $response = $this->postJson("/api/v1/admin/users/{$targetUser->id}/roles", [
            'roles' => ['superadmin'],
        ]);

        $response->assertStatus(403);
    }
}
