<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'identifier' => ['required_without_all:email,username', 'nullable', 'string'],
            'email' => ['required_without_all:identifier,username', 'nullable', 'string'],
            'username' => ['required_without_all:identifier,email', 'nullable', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Extract authentication credentials supporting email or username.
     *
     * @return array<string, mixed>
     */
    public function getCredentials(): array
    {
        $identifier = (string) ($this->input('identifier') ?? $this->input('email') ?? $this->input('username'));
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        return [
            $field => $identifier,
            'password' => (string) $this->input('password'),
        ];
    }
}
