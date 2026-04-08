<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'location_id' => 'required|exists:locations,id',
            'pickup_type' => 'nullable|in:studio,delivery',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'items.*.photos' => 'nullable|array',
            'items.*.photos.*' => 'file|mimes:jpg,jpeg,png,webp,heic|max:10240',
            'special_instructions' => 'nullable|string|max:1000',
        ];
    }
}
