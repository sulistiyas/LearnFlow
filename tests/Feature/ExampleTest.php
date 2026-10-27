<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Test that root route returns a successful 200 response with LearnFlow SPA.
     */
    public function test_the_root_route_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test that frontend SPA routes return 200 for client-side routing.
     */
    public function test_frontend_client_routes_serve_the_spa(): void
    {
        $response = $this->get('/dashboard');
        $response->assertStatus(200);

        $loginResponse = $this->get('/login');
        $loginResponse->assertStatus(200);
    }

    /**
     * Test that API and Swagger Docs routes are not intercepted by the SPA fallback.
     */
    public function test_api_routes_and_docs_are_not_shadowed_by_spa_route(): void
    {
        $healthResponse = $this->getJson('/api/v1/health');
        $healthResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $docsResponse = $this->get('/docs/api');
        $docsResponse->assertStatus(200);
    }
}
