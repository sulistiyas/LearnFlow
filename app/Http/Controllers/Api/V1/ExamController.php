<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * Create a new exam specification (Instructor / Superadmin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ujian berhasil dibuat',
            'data' => [
                'title' => $validated['title'],
            ],
        ], 201);
    }
}
