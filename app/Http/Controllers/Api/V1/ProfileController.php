<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\UploadAvatarRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Update user basic profile information.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = [
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'phone_number' => $request->input('phone_number'),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->input('password'));
        }

        $user->update($data);

        if (function_exists('activity')) {
            activity('profile')
                ->causedBy($user)
                ->performedOn($user)
                ->log('Profil pengguna berhasil diperbarui');
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil dan data pengguna berhasil diperbarui',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'avatar_url' => $user->avatar_url,
                    'status' => $user->status,
                ],
            ],
        ]);
    }

    /**
     * Upload and compress avatar image via Spatie MediaLibrary to Cloudflare R2 / Storage.
     */
    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Handle avatar upload via MediaLibrary
        $media = $user->addMediaFromRequest('avatar')
            ->toMediaCollection('avatar');

        $avatarUrl = $media->getUrl();
        $user->update(['avatar_url' => $avatarUrl]);

        if (function_exists('activity')) {
            activity('profile')
                ->causedBy($user)
                ->performedOn($user)
                ->withProperties(['media_id' => $media->id, 'avatar_url' => $avatarUrl])
                ->log('Foto avatar profil berhasil diperbarui');
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil dan avatar berhasil diperbarui',
            'data' => [
                'avatar_url' => $avatarUrl,
                'thumbnail_url' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $avatarUrl,
            ],
        ]);
    }
}
