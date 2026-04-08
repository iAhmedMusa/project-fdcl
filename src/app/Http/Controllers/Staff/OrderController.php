<?php

namespace App\Http\Controllers\Staff;

use App\Events\OrderStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PhotoRegistry;
use App\Services\OrderNumberGenerator;
use App\Services\PhotoStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderNumberGenerator $orderNumbers,
        private readonly PhotoStorage $photoStorage,
    ) {}

    public function index(Request $request): Response
    {
        $query = Order::with(['user', 'location', 'items.product', 'payments', 'photoRegistries'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by location
        if ($request->has('location_id') && $request->location_id !== 'all') {
            $query->where('location_id', $request->location_id);
        }

        // Filter by awaiting photo
        if ($request->has('awaiting_photo') && $request->awaiting_photo) {
            $query->whereDoesntHave('photoRegistries');
        }

        // Filter by date
        if ($request->has('date')) {
            switch ($request->date) {
                case 'today':
                    $query->whereDate('created_at', today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereMonth('created_at', now()->month);
                    break;
            }
        }

        // Search by order number or customer name/phone
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        // Restrict awaiting photo orders to staff's own location
        $user = request()->user();
        if ($user && $user->location_id) {
            $query->where(function ($q) use ($user) {
                // Not awaiting photo: has photo registries OR has no reprint items
                $q->whereHas('photoRegistries')
                    ->orWhereDoesntHave('items', function ($itemQ) {
                        $itemQ->whereHas('product', function ($productQ) {
                            $productQ->where('category', 'reprint');
                        });
                    })
                    // OR awaiting photo but from staff's location
                    ->orWhere('location_id', $user->location_id);
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
                'created_at_formatted' => $order->created_at->format('M d, Y H:i'),
                'user' => [
                    'name' => $order->user->name,
                    'phone' => $order->user->phone ?? 'N/A',
                ],
                'location' => [
                    'name' => $order->location->name,
                ],
                'items_count' => $order->items->count(),
                'items_summary' => $order->items->pluck('product.name')->join(', '),
                'service_types' => $order->items->pluck('product.category')->filter()->unique()->values()->all(),
                'photo_id' => $order->photoRegistries->first()?->registry_code,
                'is_awaiting_photo' => $order->isAwaitingPhoto(),
            ];
        });

        return Inertia::render('Staff/Orders', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'location_id', 'date', 'search']),
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $order = Order::with([
            'user',
            'location',
            'items.product',
            'payments.recorder',
            'photoRegistries',
        ])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        if (! $this->canManageAwaitingPhotoOrder($order)) {
            abort(403, 'You can only view awaiting photo orders from your location.');
        }

        return Inertia::render('Staff/OrderDetail', [
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
                'updated_at' => $order->updated_at->format('M d, Y \a\t H:i'),
                'is_awaiting_photo' => $order->isAwaitingPhoto(),
                'user' => [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? 'Not provided',
                    'address' => $order->user->address ?? null,
                ],
                'location' => [
                    'name' => $order->location->name,
                    'address' => $order->location->address,
                    'phone' => $order->location->phone,
                    'google_maps_url' => $order->location->google_maps_url,
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
                        'photo_paths' => $item->photo_paths ?? [],
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
                    'photo_paths' => $order->photoRegistries->first()->photo_paths ?? [],
                ] : null,
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        if (! $this->canManageAwaitingPhotoOrder($order)) {
            abort(403, 'You can only manage awaiting photo orders from your location.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,ready,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        // Staff can only make valid forward transitions
        $validTransitions = [
            'pending' => ['processing', 'cancelled'],
            'processing' => ['ready', 'cancelled'],
            'ready' => ['delivered', 'cancelled'],
            'delivered' => [], // Cannot change
            'cancelled' => [], // Cannot change
        ];

        if (! in_array($newStatus, $validTransitions[$oldStatus] ?? [])) {
            return back()->with('error', "Invalid status transition from {$oldStatus} to {$newStatus}.");
        }

        $order->status = $newStatus;
        $order->notified_at = now();
        $order->save();

        // Fire event for email notification
        if ($oldStatus !== $newStatus) {
            event(new OrderStatusChanged($order, $oldStatus));
        }

        return back()->with('success', "Order status updated to {$newStatus}.");
    }

    public function updateNotes(Request $request, Order $order)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $order->notes = $validated['notes'];
        $order->save();

        return back()->with('success', 'Notes updated.');
    }

    /**
     * Upload photo to an awaiting-photo order.
     */
    public function uploadPhoto(Request $request, Order $order): RedirectResponse
    {
        if (! $order->isAwaitingPhoto()) {
            return back()->with('error', 'This order does not need a photo upload.');
        }

        if (! $this->canManageAwaitingPhotoOrder($order)) {
            abort(403, 'You can only manage awaiting photo orders from your location.');
        }

        $validated = $request->validate([
            'photo' => 'required|image|max:10240',
        ]);

        $registryCode = $this->orderNumbers->generateRegistryCode();
        $photoPath = $this->photoStorage->store($request->file('photo'), $registryCode, $order->order_number);

        $photoRegistry = PhotoRegistry::create([
            'registry_code' => $registryCode,
            'user_id' => $order->user_id,
            'photo_paths' => [$photoPath],
            'expires_at' => now()->addYear(),
        ]);

        $order->photoRegistries()->attach($photoRegistry->id);

        foreach ($order->items as $item) {
            if ($item->product && $item->product->category === 'reprint') {
                $item->photo_paths = [$photoPath];
                $item->save();
            }
        }

        return back()->with('success', "Photo uploaded successfully. Photo ID: {$registryCode}");
    }

    private function canManageAwaitingPhotoOrder(Order $order): bool
    {
        if (! $order->isAwaitingPhoto()) {
            return true;
        }

        $user = request()->user();

        if (! $user) {
            return false;
        }

        return $order->location_id === $user->location_id;
    }
}
