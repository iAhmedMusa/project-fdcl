<?php

namespace App\Services;

use App\Models\InvoiceToken;
use App\Models\Order;
use Illuminate\Support\Str;

class InvoiceService
{
    public function createOrRenewToken(Order $order): InvoiceToken
    {
        $existing = InvoiceToken::where('order_id', $order->id)->first();

        if ($existing) {
            $existing->update(['expires_at' => now()->addDays(30)]);
            return $existing;
        }

        return InvoiceToken::create([
            'order_id'   => $order->id,
            'token'      => Str::random(12),
            'expires_at' => now()->addDays(30),
        ]);
    }

    public function getPublicUrl(InvoiceToken $token): string
    {
        return url("/i/{$token->token}");
    }
}
