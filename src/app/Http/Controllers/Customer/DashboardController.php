<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\InvoiceToken;
use App\Models\Order;
use App\Models\PhotoRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::with(['location', 'items.product', 'payments'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => (float) $order->total_amount,
                    'amount_paid' => (float) $order->amount_paid,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                    'location' => [
                        'name' => $order->location->name,
                        'address' => $order->location->address,
                    ],
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product->name,
                            'size_label' => $item->product->size_label,
                            'quantity' => $item->quantity,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    }),
                    'items_summary' => $order->items->count().' item(s)',
                ];
            });

        $photoRegistries = PhotoRegistry::where('user_id', $request->user()->id)
            ->whereHas('orders')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($registry) {
                return [
                    'code' => $registry->registry_code,
                    'photos' => array_map(fn ($p) => Storage::url($p), array_filter($registry->photo_paths ?? [])),
                    'notes' => $registry->notes,
                    'created_at' => $registry->created_at->format('M d, Y'),
                    'expires_at' => $registry->expires_at?->format('M d, Y'),
                    'is_expired' => $registry->expires_at && $registry->expires_at->isPast(),
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'orders' => $orders,
            'photoRegistries' => $photoRegistries,
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $order = Order::with(['location', 'items.product', 'payments.recorder', 'photoRegistries'])
            ->where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('Customer/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'pickup_type' => $order->pickup_type ?? 'studio',
                'total_amount' => (float) $order->total_amount,
                'amount_paid' => (float) $order->amount_paid,
                'balance' => (float) ($order->total_amount - $order->amount_paid),
                'special_instructions' => $order->special_instructions,
                'created_at' => $order->created_at->format('M d, Y \a\t H:i'),
                'updated_at' => $order->updated_at->format('M d, Y \a\t H:i'),
                'location' => [
                    'name' => $order->location->name,
                    'address' => $order->location->address,
                    'google_maps_url' => $order->location->google_maps_url,
                    'phone' => $order->location->phone,
                ],
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product->name,
                        'category' => $item->product->category,
                        'size_label' => $item->product->size_label,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                        'photo_paths' => array_map(fn ($p) => Storage::url($p), array_filter($item->photo_paths ?? [])),
                        'photo_source' => $item->photo_source,
                        'item_specific_notes' => $item->item_specific_notes,
                    ];
                }),
                'payments' => $order->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'amount' => (float) $payment->amount,
                        'method' => $payment->method,
                        'reference' => $payment->reference,
                        'notes' => $payment->notes,
                        'paid_at' => $payment->paid_at->format('M d, Y H:i'),
                        'recorded_by' => $payment->recorder ? $payment->recorder->name : 'System',
                    ];
                }),
                'photo_registry' => $order->photoRegistries->first() ? [
                    'registry_code' => $order->photoRegistries->first()->registry_code,
                    'photo_paths' => array_map(fn ($p) => Storage::url($p), array_filter($order->photoRegistries->first()->photo_paths ?? [])),
                ] : null,
            ],
            'invoiceToken' => InvoiceToken::where('order_id', $order->id)->value('token'),
        ]);
    }
}
