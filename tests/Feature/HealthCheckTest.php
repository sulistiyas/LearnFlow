<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test health check endpoint returns 200 and healthy infrastructure status.
     */
    public function test_health_check_returns_success_with_database_and_redis(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'database' => [
                        'driver' => 'pgsql',
                        'status' => 'connected',
                    ],
                    'redis' => [
                        'status' => 'connected',
                    ],
                ],
            ]);
    }

    /**
     * Test Dedoc Scramble API documentation UI is accessible.
     */
    public function test_api_documentation_is_accessible(): void
    {
        $response = $this->get('/docs/api');

        $response->assertStatus(200);
    }
}
