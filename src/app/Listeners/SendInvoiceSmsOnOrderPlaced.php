<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Services\InvoiceService;
use App\Services\SmsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendInvoiceSmsOnOrderPlaced implements ShouldQueue
{
    public function __construct(
        private InvoiceService $invoiceService,
        private SmsService $smsService,
    ) {}

    public function handle(OrderPlaced $event): void
    {
        $order = $event->order->loadMissing('user');
        $phone = $order->user->phone ?? null;

        if (! $phone) {
            Log::info('Invoice SMS skipped — no phone on order', ['order' => $order->order_number]);
            return;
        }

        try {
            $token = $this->invoiceService->createOrRenewToken($order);
            $url   = $this->invoiceService->getPublicUrl($token);
            $sent  = $this->smsService->sendInvoiceLink($phone, $url, $order->order_number, $order->user->name ?? null);
            if ($sent) {
                $token->update(['sms_sent' => true]);
            }
        } catch (\Throwable $e) {
            Log::error('Invoice SMS failed', [
                'order' => $order->order_number,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
