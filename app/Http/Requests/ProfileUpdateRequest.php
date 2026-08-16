<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', \Illuminate\Validation\Rule::unique(\App\Models\User::class)->ignore($this->user()->id)],
            'sexo' => ['required', 'string', 'max:50'],
            'fecha_nacimiento' => ['required', 'date', 'before:today'],
            'sede' => ['required', 'in:Santiago,Concepcion'],
        ];
    }
}
