<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Mail\OrderCancelled;
use App\Mail\OrderDelivered;
use App\Mail\OrderProcessing;
use App\Mail\OrderReady;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendStatusUpdateEmail implements ShouldQueue
{
    public function handle(OrderStatusChanged $event): void
    {
        $order = $event->order->load(['user', 'location', 'items.product']);
        $status = $order->status;

        $mailable = match ($status) {
            'processing' => new OrderProcessing($order),
            'ready' => new OrderReady($order),
            'delivered' => new OrderDelivered($order),
            'cancelled' => new OrderCancelled($order),
            default => null,
        };

        if ($mailable) {
            Mail::to($order->user->email)->send($mailable);
        }
    }
}
