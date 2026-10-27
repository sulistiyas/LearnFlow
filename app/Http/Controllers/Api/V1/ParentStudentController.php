<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parent\LinkStudentRequest;
use App\Models\ParentStudent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentStudentController extends Controller
{
    /**
     * Link student account to parent using student's code/NIS.
     */
    public function linkStudent(LinkStudentRequest $request): JsonResponse
    {
        /** @var User $parent */
        $parent = $request->user();

        /** @var User $student */
        $student = User::where('student_code', $request->input('student_code'))->firstOrFail();

        if ($parent->id === $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghubungkan akun Anda sendiri sebagai anak asuh.',
            ], 422);
        }

        $link = ParentStudent::updateOrCreate(
            [
                'parent_id' => $parent->id,
                'student_id' => $student->id,
            ],
            [
                'relationship' => $request->input('relationship', 'guardian'),
                'is_verified' => true,
            ]
        );

        if (function_exists('activity')) {
            activity('parent')
                ->causedBy($parent)
                ->performedOn($student)
                ->withProperties([
                    'relationship' => $link->relationship,
                    'student_code' => $student->student_code,
                ])
                ->log("Akun wali berhasil dihubungkan dengan anak asuh: {$student->name}");
        }

        return response()->json([
            'success' => true,
            'message' => "Berhasil menghubungkan akun dengan siswa {$student->name}",
            'data' => [
                'link_id' => $link->id,
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'username' => $student->username,
                    'student_code' => $student->student_code,
                    'avatar_url' => $student->avatar_url,
                ],
                'relationship' => $link->relationship,
                'is_verified' => $link->is_verified,
            ],
        ], 201);
    }

    /**
     * Retrieve list of wards/students linked to the authenticated parent.
     */
    public function wards(Request $request): JsonResponse
    {
        /** @var User $parent */
        $parent = $request->user();

        $wards = ParentStudent::with(['student'])
            ->where('parent_id', $parent->id)
            ->get()
            ->map(fn (ParentStudent $link) => [
                'id' => $link->id,
                'student_id' => $link->student_id,
                'student_name' => $link->student?->name,
                'student_username' => $link->student?->username,
                'student_code' => $link->student?->student_code,
                'avatar_url' => $link->student?->avatar_url,
                'relationship' => $link->relationship,
                'is_verified' => $link->is_verified,
                'linked_at' => $link->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Daftar anak asuh berhasil dimuat',
            'data' => $wards,
        ]);
    }
}
