<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['user', 'location', 'items'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by location
        if ($request->has('location_id') && $request->location_id !== 'all') {
            $query->where('location_id', $request->location_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->paginate(20)->through(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'amount_paid' => (float) $order->amount_paid,
                'created_at' => $order->created_at->diffForHumans(),
                'user' => [
                    'name' => $order->user?->name ?? 'N/A',
                    'email' => $order->user?->email ?? 'N/A',
                ],
                'location' => [
                    'name' => $order->location?->name ?? 'N/A',
                ],
                'items_count' => $order->items->count(),
            ];
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'location_id', 'search']),
        ]);
    }

    public function show(string $orderNumber): Response
    {
        $order = Order::with(['user', 'location', 'items.product', 'payments.recorder', 'photoRegistries'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        // Admin can view any order

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'amount_paid' => (float) $order->amount_paid,
                'balance' => (float) ($order->total_amount - $order->amount_paid),
                'notes' => $order->notes,
                'special_instructions' => $order->special_instructions,
                'paper_type' => $order->paper_type,
                'created_at' => $order->created_at->format('M d, Y \a\t H:i'),
                'user' => [
                    'id' => $order->user?->id,
                    'name' => $order->user?->name ?? 'N/A',
                    'email' => $order->user?->email ?? 'N/A',
                    'phone' => $order->user?->phone ?? 'Not provided',
                ],
                'location' => [
                    'name' => $order->location?->name ?? 'N/A',
                    'address' => $order->location?->address ?? 'N/A',
                ],
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name ?? 'N/A',
                        'category' => $item->product?->category ?? 'N/A',
                        'size_label' => $item->product?->size_label ?? 'N/A',
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                        'photo_paths' => $item->photo_paths ?? [],
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
                ] : null,
            ],
        ]);
    }
}
