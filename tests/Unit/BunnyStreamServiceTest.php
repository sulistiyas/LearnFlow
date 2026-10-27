<?php

namespace Tests\Unit;

use App\Services\BunnyStreamService;
use PHPUnit\Framework\TestCase;

class BunnyStreamServiceTest extends TestCase
{
    /**
     * Test token generation with fixed credentials.
     */
    public function test_token_generation_returns_valid_sha256_hash(): void
    {
        $service = new BunnyStreamService(
            apiKey: 'test-api-key',
            libraryId: '12345',
            tokenSecurityKey: 'secret-token-key',
            pullZoneHost: 'video.learnflow.io'
        );

        $videoId = '01HZX87K9WABCDEF0123456789';
        $expires = 1700000000;

        $token = $service->generateToken($videoId, $expires);

        $expectedHash = hash('sha256', 'secret-token-key/'.$videoId.'/'.$expires);
        $this->assertEquals($expectedHash, $token);
    }

    /**
     * Test signed HLS URL formatting.
     */
    public function test_signed_hls_url_contains_token_and_expires_params(): void
    {
        $service = new BunnyStreamService(
            tokenSecurityKey: 'sample-key',
            pullZoneHost: 'cdn.learnflow.io'
        );

        $videoId = 'vid-abc-123';
        $url = $service->generateSignedHlsUrl($videoId, 3600);

        $this->assertStringStartsWith('https://cdn.learnflow.io/vid-abc-123/playlist.m3u8?token=', $url);
        $this->assertStringContainsString('&expires=', $url);
    }
}
