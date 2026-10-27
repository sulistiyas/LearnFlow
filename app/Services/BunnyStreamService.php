<?php

namespace App\Services;

class BunnyStreamService
{
    /**
     * BunnyStreamService constructor.
     */
    public function __construct(
        protected ?string $apiKey = null,
        protected ?string $libraryId = null,
        protected ?string $tokenSecurityKey = null,
        protected ?string $pullZoneHost = null
    ) {
        $hasConfig = function_exists('config') && app()->has('config');

        $this->apiKey = $apiKey ?? ($hasConfig ? config('services.bunny.stream_api_key') : null) ?? env('BUNNY_STREAM_API_KEY');
        $this->libraryId = $libraryId ?? ($hasConfig ? config('services.bunny.stream_library_id') : null) ?? env('BUNNY_STREAM_LIBRARY_ID');
        $this->tokenSecurityKey = $tokenSecurityKey ?? ($hasConfig ? config('services.bunny.token_security_key') : null) ?? env('BUNNY_TOKEN_SECURITY_KEY');
        $this->pullZoneHost = $pullZoneHost ?? ($hasConfig ? config('services.bunny.pull_zone_host') : null) ?? env('BUNNY_PULL_ZONE_HOST', 'video.learnflow.io');
    }

    /**
     * Generate a signed HLS URL with anti-piracy token authentication.
     */
    public function generateSignedHlsUrl(string $videoId, int $expirationSeconds = 7200, ?string $userIp = null): string
    {
        $expires = time() + $expirationSeconds;
        $token = $this->generateToken($videoId, $expires, $userIp);

        $baseUrl = "https://{$this->pullZoneHost}/{$videoId}/playlist.m3u8";

        return "{$baseUrl}?token={$token}&expires={$expires}";
    }

    /**
     * Generate Bunny.net SHA256 token authentication hash.
     */
    public function generateToken(string $videoId, int $expires, ?string $userIp = null): string
    {
        $securityKey = $this->tokenSecurityKey ?? 'default_secret';
        $path = "/{$videoId}/";

        // Bunny.net token formula: SHA256(security_key + path + expires + [user_ip])
        $hashable = $securityKey.$path.$expires;
        if ($userIp) {
            $hashable .= $userIp;
        }

        return hash('sha256', $hashable);
    }
}
