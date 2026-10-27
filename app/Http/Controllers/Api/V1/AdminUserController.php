<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignRoleRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class AdminUserController extends Controller
{
    /**
     * List users with their roles.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(20)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
                'student_code' => $user->student_code,
                'roles' => $user->getRoleNames(),
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pengguna berhasil dimuat',
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Assign / synchronize roles for a user.
     */
    public function assignRoles(AssignRoleRequest $request, User $user): JsonResponse
    {
        $roles = $request->input('roles');
        $oldRoles = $user->getRoleNames()->toArray();

        $user->syncRoles($roles);

        if (function_exists('activity')) {
            activity('rbac')
                ->causedBy($request->user())
                ->performedOn($user)
                ->withProperties([
                    'old_roles' => $oldRoles,
                    'new_roles' => $roles,
                ])
                ->log("Hak akses / peran pengguna {$user->name} berhasil diperbarui");
        }

        return response()->json([
            'success' => true,
            'message' => "Peran pengguna {$user->name} berhasil diperbarui",
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }

    /**
     * Retrieve audit logs trail.
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $logs = Activity::with('causer')
            ->latest()
            ->paginate(30)
            ->through(fn (Activity $act) => [
                'id' => $act->id,
                'log_name' => $act->log_name,
                'description' => $act->description,
                'causer_name' => $act->causer instanceof User ? $act->causer->name : 'System',
                'causer_email' => $act->causer instanceof User ? $act->causer->email : null,
                'properties' => $act->properties,
                'created_at' => $act->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Log audit sistem berhasil dimuat',
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
            ],
        ]);
    }
}
