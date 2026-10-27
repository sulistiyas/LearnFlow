<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuditTrailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
    }

    /**
     * Test successful login creates activity_log entry and records IP.
     */
    public function test_successful_login_records_audit_trail_and_ip(): void
    {
        $user = User::factory()->create([
            'email' => 'audit_success@learnflow.io',
            'password' => Hash::make('secretpass'),
        ]);

        $this->postJson('/api/v1/auth/login', [
            'identifier' => 'audit_success@learnflow.io',
            'password' => 'secretpass',
        ]);

        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'auth',
            'causer_id' => $user->id,
            'description' => 'Pengguna berhasil masuk ke sistem',
        ]);

        $this->assertNotNull($user->fresh()->last_login_at);
        $this->assertNotNull($user->fresh()->last_login_ip);
    }

    /**
     * Test failed login creates activity_log entry with invalid credentials info.
     */
    public function test_failed_login_records_audit_trail(): void
    {
        User::factory()->create([
            'email' => 'audit_fail@learnflow.io',
            'password' => Hash::make('realpassword'),
        ]);

        $this->postJson('/api/v1/auth/login', [
            'identifier' => 'audit_fail@learnflow.io',
            'password' => 'wrongpassword',
        ]);

        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'auth',
            'description' => 'Percobaan masuk gagal: Kredensial tidak valid',
        ]);
    }

    /**
     * Test superadmin can retrieve audit logs list.
     */
    public function test_superadmin_can_retrieve_audit_logs(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('superadmin');

        Activity::create([
            'log_name' => 'system',
            'description' => 'Pengujian entri log sistem',
            'causer_type' => User::class,
            'causer_id' => $admin->id,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/audit-logs');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'description' => 'Pengujian entri log sistem',
            ]);
    }
}
