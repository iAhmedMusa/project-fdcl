<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use Illuminate\Http\Request;

trait HandlesDelivery
{
    protected function deliveryRules(): array
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
        ];
    }

    protected function buildDeliveryAddress(array $validated): ?string
    {
        if ($validated['pickup_type'] !== 'delivery') {
            return null;
        }

        return implode(', ', array_filter([
            $validated['flat']        ?? null,
            $validated['road']        ?? null,
            $validated['block']       ?? null,
            $validated['postal_code'] ?? null,
            'Dhaka',
        ]));
    }

    protected function deliveryFee(array $validated): float
    {
        if ($validated['pickup_type'] !== 'delivery') {
            return 0;
        }

        return $validated['delivery_type'] === 'express'
            ? (float) config('services.steadfast.express_fee')
            : (float) config('services.steadfast.regular_fee');
    }

    protected function deliveryOrderFields(array $validated): array
    {
        $isDelivery = $validated['pickup_type'] === 'delivery';

        return [
            'pickup_type'           => $validated['pickup_type'],
            'location_id'           => $isDelivery ? null : ($validated['location_id'] ?? null),
            'delivery_type'         => $isDelivery ? $validated['delivery_type'] : null,
            'delivery_address'      => $this->buildDeliveryAddress($validated),
            'delivery_instructions' => $isDelivery ? ($validated['delivery_instructions'] ?? null) : null,
            'delivery_fee'          => $this->deliveryFee($validated),
        ];
    }

    protected function saveAddressToProfile(User $user, array $validated): void
    {
        if ($validated['pickup_type'] !== 'delivery') {
            return;
        }

        $user->update(['address' => $this->buildDeliveryAddress($validated)]);
    }

    protected function deliveryFees(): array
    {
        return [
            'regular' => config('services.steadfast.regular_fee'),
            'express' => config('services.steadfast.express_fee'),
        ];
    }
}
