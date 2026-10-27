<?php

use App\Http\Controllers\Api\V1\AdminUserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\ParentStudentController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // 1. Infrastructure Health Check
    Route::get('/health', function (): JsonResponse {
        $dbStatus = 'disconnected';
        $dbName = null;
        try {
            DB::connection()->getPdo();
            $dbName = DB::connection()->getDatabaseName();
            $dbStatus = 'connected';
        } catch (Throwable $e) {
            $dbStatus = 'error: '.$e->getMessage();
        }

        $redisStatus = 'disconnected';
        try {
            Cache::store('redis')->put('health_check_ping', 'pong', 10);
            $pong = Cache::store('redis')->get('health_check_ping');
            $redisStatus = ($pong === 'pong') ? 'connected' : 'unexpected_response';
        } catch (Throwable $e) {
            $redisStatus = 'error: '.$e->getMessage();
        }

        $isHealthy = ($dbStatus === 'connected') && ($redisStatus === 'connected');

        return response()->json([
            'success' => $isHealthy,
            'message' => $isHealthy ? 'Layanan berjalan normal' : 'Gangguan pada infrastruktur',
            'data' => [
                'database' => [
                    'driver' => 'pgsql',
                    'database' => $dbName,
                    'status' => $dbStatus,
                ],
                'redis' => [
                    'client' => config('database.redis.client'),
                    'status' => $redisStatus,
                ],
                'reverb' => [
                    'host' => config('reverb.servers.reverb.host', '0.0.0.0'),
                    'port' => config('reverb.servers.reverb.port', 8080),
                ],
            ],
            'meta' => [
                'timestamp' => now()->toIso8601String(),
                'environment' => app()->environment(),
            ],
        ], $isHealthy ? 200 : 503);
    });

    // 2. Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // 3. User Self-Profile Management
    Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
    });

    // 4. Parent - Student Portal Linking
    Route::middleware(['auth:sanctum', 'role:parent|superadmin'])->prefix('parent')->group(function () {
        Route::post('/link-student', [ParentStudentController::class, 'linkStudent']);
        Route::get('/wards', [ParentStudentController::class, 'wards']);
    });

    // 5. RBAC & CBT Exam Management (Role restriction tests)
    Route::middleware(['auth:sanctum', 'role:instructor|superadmin'])->group(function () {
        Route::post('/exams', [ExamController::class, 'store']);
    });

    // 6. Superadmin User Management & Audit Logs
    Route::middleware(['auth:sanctum', 'role:superadmin'])->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRoles']);
        Route::get('/audit-logs', [AdminUserController::class, 'auditLogs']);
    });
});
