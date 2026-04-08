<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\PhotoRegistry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmed extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public ?PhotoRegistry $registry;

    public function __construct(public Order $order)
    {
        $this->registry = PhotoRegistry::where('order_id', $order->id)->first();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your order {$this->order->order_number} is confirmed — Focus Digital Color Lab",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.confirmed',
            with: [
                'order' => $this->order,
                'registry' => $this->registry,
            ],
        );
    }
}
