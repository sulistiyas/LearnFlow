<?php

namespace App\Http\Requests\Parent;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LinkStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_code' => ['required', 'string', 'exists:users,student_code'],
            'relationship' => ['nullable', 'string', 'in:father,mother,guardian'],
        ];
    }
}
