<?php

namespace Tests\Feature;

use App\Models\InvoiceToken;
use App\Models\Order;
use Tests\TestCase;

class InvoiceExpiredTest extends TestCase
{
    public function test_expired_token_is_detected(): void
    {
        $token = new InvoiceToken(['expires_at' => now()->subDay()]);

        $this->assertTrue($token->isExpired());
    }

    public function test_valid_token_is_not_expired(): void
    {
        $token = new InvoiceToken(['expires_at' => now()->addDays(30)]);

        $this->assertFalse($token->isExpired());
    }

    public function test_expired_blade_explains_reason_in_plain_language(): void
    {
        $html = view('invoice.expired', [
            'orderNumber' => 'FDCL-123',
            'expiresAt' => now()->subDay(),
        ])->render();

        $this->assertStringContainsString('This invoice link has expired', $html);
        $this->assertStringContainsString('only work for 30 days', $html);
        $this->assertStringContainsString('Your order and invoice still exist', $html);
        $this->assertStringContainsString('Log in to view my invoice', $html);
        $this->assertStringContainsString('FDCL-123', $html);
    }

    public function test_public_invoice_view_survives_missing_relations(): void
    {
        $order = new Order([
            'order_number' => 'DUMMY-NULL',
            'status' => 'pending',
            'total_amount' => 100,
        ]);
        $order->id = 999999;
        $order->created_at = now();

        $html = view('invoice.public', ['order' => $order, 'token' => 'dummy'])->render();

        $this->assertStringContainsString('Guest', $html);
        $this->assertStringContainsString('N/A', $html);
    }
}
