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
            'pickup_type'           => 'required|in:studio,delivery',
            'location_id'           => 'required_if:pickup_type,studio|nullable|exists:locations,id',
            'delivery_type'         => 'required_if:pickup_type,delivery|nullable|in:regular,express',
            'flat'                  => 'required_if:pickup_type,delivery|nullable|string|max:100',
            'road'                  => 'required_if:pickup_type,delivery|nullable|string|max:100',
            'block'                 => 'nullable|string|max:100',
            'postal_code'           => 'required_if:pickup_type,delivery|nullable|string|max:20',
            'delivery_instructions' => 'nullable|string|max:500',
            'items'                 => 'required|array|min:1',
            'items.*.product_id'    => 'required|exists:products,id',
            'items.*.quantity'      => 'required|integer|min:1|max:100',
            'items.*.photos'        => 'nullable|array',
            'items.*.photos.*'      => 'file|mimes:jpg,jpeg,png,webp,heic|max:10240',
            'special_instructions'  => 'nullable|string|max:1000',
            'bkash_reference'       => 'required|string|max:100',
        ];
    }
}
