<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Authenticate user with Sanctum cookie or Bearer token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->getCredentials();
        $identifierField = array_key_first($credentials);
        $identifierValue = $credentials[$identifierField];
        $password = $credentials['password'];

        /** @var User|null $user */
        $user = User::where($identifierField, $identifierValue)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            event(new Failed('web', $user, $credentials));

            return response()->json([
                'success' => false,
                'message' => 'Kredensial tidak valid. Silakan periksa kembali email/username dan kata sandi Anda.',
                'errors' => [
                    'identifier' => ['Kredensial tidak cocok dengan data kami.'],
                ],
            ], 422);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda saat ini tidak aktif atau ditangguhkan.',
            ], 403);
        }

        // Web session for SPA HTTP-Only Cookie
        if ($request->hasSession()) {
            Auth::guard('web')->login($user, $request->boolean('remember'));
            $request->session()->regenerate();
        }

        event(new Login('web', $user, $request->boolean('remember')));

        // Generate Bearer token for direct API consumers
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Autentikasi berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'avatar_url' => $user->avatar_url,
                    'student_code' => $user->student_code,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at?->toIso8601String(),
                ],
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'token' => $token,
            ],
        ]);
    }

    /**
     * Terminate the authenticated session and revoke tokens.
     */
    public function logout(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user) {
            // Revoke current access token if present
            $user->currentAccessToken()?->delete();
            event(new Logout('web', $user));
        }

        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar dari sistem',
            'data' => null,
        ]);
    }

    /**
     * Retrieve current authenticated user profile and authorizations.
     */
    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Data profil pengguna berhasil dimuat',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'avatar_url' => $user->avatar_url,
                    'student_code' => $user->student_code,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at?->toIso8601String(),
                    'created_at' => $user->created_at?->toIso8601String(),
                ],
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }
}
