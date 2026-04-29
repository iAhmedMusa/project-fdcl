<?php

namespace App\Http\Controllers\Staff;

use App\Events\OrderStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\InvoiceToken;
use App\Models\Order;
use App\Models\PhotoRegistry;
use App\Services\InvoiceService;
use App\Services\OrderNumberGenerator;
use App\Services\PhotoStorage;
use App\Services\PathaoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderNumberGenerator $orderNumbers,
        private readonly PhotoStorage $photoStorage,
        private readonly PathaoService $pathao,
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

        // Location scoping: show this staff's studio orders + all unassigned delivery orders
        $user = request()->user();
        if ($user && $user->location_id) {
            $query->where(function ($q) use ($user) {
                // Own studio orders (all states)
                $q->where('location_id', $user->location_id)
                  // Unassigned delivery orders visible to all staff
                  ->orWhere(function ($q2) {
                      $q2->where('pickup_type', 'delivery')->whereNull('location_id');
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
                'created_at_formatted' => $order->created_at->format('M d, Y H:i'),
                'user' => [
                    'name' => $order->user->name,
                    'phone' => $order->user->phone ?? 'N/A',
                ],
                'location' => $order->location ? ['name' => $order->location->name] : null,
                'pickup_type' => $order->pickup_type,
                'delivery_type' => $order->delivery_type,
                'pathao_consignment_id' => $order->pathao_consignment_id,
                'items_count' => $order->items->count(),
                'items_summary' => $order->items->pluck('product.name')->join(', '),
                'service_types' => $order->items->pluck('product.category')->filter()->unique()->values()->all(),
                'reprint_source' => $order->items->firstWhere('product.category', 'reprint')?->reprint_source,
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
                'discount_amount' => (float) $order->discount_amount,
                'amount_paid' => (float) $order->amount_paid,
                'balance' => (float) ($order->total_amount - $order->discount_amount - $order->amount_paid),
                'notes' => $order->notes,
                'special_instructions' => $order->special_instructions,
                'paper_type' => $order->paper_type,
                'pickup_type' => $order->pickup_type,
                'delivery_type' => $order->delivery_type,
                'delivery_address' => $order->delivery_address,
                'delivery_instructions' => $order->delivery_instructions,
                'delivery_fee' => (float) $order->delivery_fee,
                'pathao_consignment_id' => $order->pathao_consignment_id,
                'pathao_delivery_status' => $order->pathao_delivery_status,
                'created_at' => $order->created_at->format('M d, Y \a\t H:i'),
                'updated_at' => $order->updated_at->format('M d, Y \a\t H:i'),
                'is_awaiting_photo' => $order->isAwaitingPhoto(),
                'user' => [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? 'Not provided',
                    'address' => $order->user->address ?? null,
                ],
                'location' => $order->location ? [
                    'name' => $order->location->name,
                    'address' => $order->location->address,
                    'phone' => $order->location->phone,
                    'google_maps_url' => $order->location->google_maps_url,
                ] : null,
                'items' => $order->items->map(function ($item) use ($order) {
                    $registryCode = null;
                    if ($item->product && $item->product->category === 'reprint' && ! empty($item->photo_paths)) {
                        // Match item photo path against attached registries
                        $firstPath = $item->photo_paths[0];
                        $registry = $order->photoRegistries->first(function ($reg) use ($firstPath) {
                            return in_array($firstPath, $reg->photo_paths ?? []);
                        });
                        // Fallback: extract code from filename
                        $registryCode = $registry
                            ? $registry->registry_code
                            : strtoupper(pathinfo(basename($firstPath), PATHINFO_FILENAME));
                    }

                    return [
                        'id' => $item->id,
                        'product_name' => $item->product ? $item->product->name : ($item->reprint_source === 'studio_fee' ? 'Studio Fee' : 'N/A'),
                        'category' => $item->product ? $item->product->category : ($item->reprint_source === 'studio_fee' ? 'studio_fee' : null),
                        'size_label' => $item->product?->size_label,
                        'product_description' => $item->product?->description,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'subtotal' => (float) $item->subtotal,
                        'photo_paths' => array_map(fn ($p) => Storage::url($p), array_filter($item->photo_paths ?? [])),
                        'photo_source' => $item->photo_source,
                        'item_specific_notes' => $item->item_specific_notes,
                        'registry_code' => $registryCode,
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
            'smsSent' => (bool) InvoiceToken::where('order_id', $order->id)->value('sms_sent'),
            'hasPhone' => ! empty($order->user->phone),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        if (! $this->canManageAwaitingPhotoOrder($order)) {
            abort(403, 'You can only manage awaiting photo orders from your location.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,ready,out_for_delivery,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        $validTransitions = [
            'pending'          => ['processing', 'cancelled'],
            'processing'       => ['ready', 'cancelled'],
            'ready'            => ['out_for_delivery', 'delivered', 'cancelled'],
            'out_for_delivery' => ['delivered', 'cancelled'],
            'delivered'        => [],
            'cancelled'        => [],
        ];

        if (! in_array($newStatus, $validTransitions[$oldStatus] ?? [])) {
            return back()->with('error', "Invalid status transition from {$oldStatus} to {$newStatus}.");
        }

        // Only delivery orders can go to out_for_delivery
        if ($newStatus === 'out_for_delivery' && ! $order->isDelivery()) {
            return back()->with('error', 'Studio pickup orders cannot be set to out_for_delivery.');
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

    public function dispatch(Request $request, Order $order): RedirectResponse
    {
        if (! $order->isDelivery()) {
            return back()->with('error', 'This order is not a delivery order.');
        }

        if ($order->status !== 'ready') {
            return back()->with('error', 'Order must be in "ready" status before dispatching.');
        }

        if ($order->pathao_consignment_id) {
            return back()->with('error', 'This order has already been dispatched.');
        }

        $validated = $request->validate([
            'item_type' => 'required|integer|in:1,2',
            'weight'    => 'required|numeric|min:0.5|max:10',
        ]);

        try {
            $result = $this->pathao->createOrder(
                $order,
                (int) $validated['item_type'],
                (float) $validated['weight']
            );

            $consignmentId = $result['data']['consignment_id'] ?? null;

            if (! $consignmentId) {
                return back()->with('error', 'Pathao returned an unexpected response. Please try again.');
            }

            $staffUser = $request->user();
            $oldStatus = $order->status;

            $order->pathao_consignment_id  = $consignmentId;
            $order->pathao_delivery_status = 'Pending';
            $order->location_id            = $staffUser->location_id;
            $order->status                 = 'out_for_delivery';
            $order->notified_at            = now();
            $order->save();

            event(new OrderStatusChanged($order, $oldStatus));

            return back()->with('success', "Dispatched via Pathao. Consignment: {$consignmentId}");
        } catch (\RuntimeException $e) {
            return back()->with('error', 'Pathao error: ' . $e->getMessage());
        }
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
        if (! $this->canManageAwaitingPhotoOrder($order)) {
            abort(403, 'You can only manage awaiting photo orders from your location.');
        }

        $validated = $request->validate([
            'photo'   => 'required|image|max:10240',
            'item_id' => 'required|integer',
        ]);

        $item = $order->items()->with('product')->find($validated['item_id']);

        if (! $item || ! $item->product || $item->product->category !== 'reprint') {
            return back()->with('error', 'Invalid item for photo upload.');
        }

        if (! empty($item->photo_paths)) {
            return back()->with('error', 'This item already has a photo.');
        }

        $registryCode = $this->orderNumbers->generateRegistryCode();
        $photoPath = $this->photoStorage->store($request->file('photo'), $registryCode, $order->order_number);

        $photoRegistry = PhotoRegistry::create([
            'registry_code' => $registryCode,
            'user_id'       => $order->user_id,
            'photo_paths'   => [$photoPath],
            'expires_at'    => now()->addYears(3),
        ]);

        $order->photoRegistries()->attach($photoRegistry->id);

        $item->photo_paths = [$photoPath];
        $item->save();

        return back()->with('success', "Photo uploaded. Photo ID: {$registryCode}");
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
