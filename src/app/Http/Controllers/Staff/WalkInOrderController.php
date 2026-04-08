<?php

declare(strict_types=1);

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PhotoRegistry;
use App\Models\Product;
use App\Models\User;
use App\Services\OrderNumberGenerator;
use App\Services\PhotoStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class WalkInOrderController extends Controller
{
    public function __construct(
        private readonly OrderNumberGenerator $orderNumbers,
        private readonly PhotoStorage $photoStorage,
    ) {}

    public function create(): Response
    {
        $products = Product::where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get(['id', 'name', 'category', 'size_label', 'price', 'description']);

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        return Inertia::render('Staff/CreateOrder', [
            'products' => $products,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:users,id',
            'customer_name' => 'required_without:customer_id|string|max:100',
            'customer_phone' => 'required_without:customer_id|string|max:20',
            'customer_email' => 'nullable|email|max:150',
            'location_id' => 'required|exists:locations,id',
            'delivery_method' => 'required|in:pickup,home',
            'special_instructions' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'services' => 'required|array|min:1',
            'reprint' => 'required_if:services,reprint|array',
            'reprint.source' => 'required_with:reprint|in:registry,manual,upload,awaiting',
            'reprint.product_id' => 'required_with:reprint|exists:products,id',
            'reprint.quantity' => 'required_with:reprint|integer|min:1|max:100',
            'reprint.paper_type' => 'nullable|in:glossy,matte',
            'reprint.registry_code' => 'nullable|string',
            'reprint.photo_id' => 'required_if:reprint.source,manual|nullable|string',
            'reprint.confirm_share' => 'nullable|boolean',
            'album' => 'required_if:services,album|array',
            'album.product_id' => 'required_with:album|exists:products,id',
            'album.quantity' => 'required_with:album|integer|min:1|max:100',
            'album.photo_source' => 'nullable|string|max:1000',
            'album.notes' => 'nullable|string|max:1000',
            'frame' => 'required_if:services,frame|array',
            'frame.product_id' => 'required_with:frame|exists:products,id',
            'frame.quantity' => 'required_with:frame|integer|min:1|max:100',
            'frame.photo_source' => 'nullable|string|max:1000',
            'frame.notes' => 'nullable|string|max:1000',
            'mug' => 'required_if:services,mug|array',
            'mug.product_id' => 'required_with:mug|exists:products,id',
            'mug.quantity' => 'required_with:mug|integer|min:1|max:100',
            'mug.photo_source' => 'nullable|string|max:1000',
            'mug.notes' => 'nullable|string|max:1000',
            'discount_amount' => 'nullable|numeric|min:0',
            'payment_amount' => 'nullable|numeric|min:0.01',
            'payment_method' => 'required_with:payment_amount|in:cash,bkash,nagad,card,other',
            'payment_reference' => 'nullable|string|max:100',
        ]);

        $order = DB::transaction(function () use ($validated, $request): Order {
            // Resolve or create walk-in customer
            if (! empty($validated['customer_id'])) {
                $customer = User::findOrFail($validated['customer_id']);
            } else {
                $email = ! empty($validated['customer_email'])
                    ? $validated['customer_email']
                    : 'walkin_'.uniqid().'@fdcl.local';

                $customer = User::create([
                    'name' => $validated['customer_name'],
                    'phone' => $validated['customer_phone'],
                    'email' => $email,
                    'password' => Hash::make(Str::random(32)),
                    'is_active' => true,
                    'is_walk_in' => true,
                ]);
                $customer->assignRole('customer');
            }

            $orderNumber = $this->orderNumbers->generate();
            $reprintAmount = 0;
            $albumAmount = 0;
            $frameAmount = 0;
            $mugAmount = 0;
            $photoRegistry = null;
            $uploadedRegistryCode = null;
            $photoPaths = [];

            // Calculate reprint amount first
            if (in_array('reprint', $validated['services'])) {
                $reprint = $validated['reprint'];
                $product = Product::findOrFail($reprint['product_id']);
                $quantity = $reprint['quantity'];
                $reprintAmount = $product->price * $quantity;

                // Handle different sources
                if ($reprint['source'] === 'registry' && ! empty($reprint['registry_code'])) {
                    $registry = PhotoRegistry::where('registry_code', strtoupper($reprint['registry_code']))->first();
                    if ($registry) {
                        if ($registry->user_id && $registry->user_id !== $customer->id) {
                            if (empty($reprint['confirm_share'])) {
                                throw ValidationException::withMessages([
                                    'reprint.registry_code' => 'This Photo ID is already associated with another customer. Please confirm to share it.',
                                ]);
                            }
                        }
                        $photoPaths = $registry->photo_paths ?? [];
                        $photoRegistry = $registry;
                    }
                } elseif ($reprint['source'] === 'manual' && ! empty($reprint['photo_id'])) {
                    $registry = PhotoRegistry::where('registry_code', strtoupper($reprint['photo_id']))->first();
                    if ($registry) {
                        if ($registry->user_id && $registry->user_id !== $customer->id) {
                            if (empty($reprint['confirm_share'])) {
                                throw ValidationException::withMessages([
                                    'reprint.photo_id' => 'This Photo ID is already associated with another customer. Please confirm to share it.',
                                ]);
                            }
                        }
                        $photoPaths = $registry->photo_paths ?? [];
                        $photoRegistry = $registry;
                    }
                } elseif ($reprint['source'] === 'manual' || $reprint['source'] === 'awaiting') {
                    // Walk-in or existing customer with no photo ID yet - leave order without photo_registry
                    // Staff will upload photo later, which triggers registry creation
                } elseif ($reprint['source'] === 'upload' && $request->hasFile('reprint_file')) {
                    // Handle uploaded file - generate registry code first
                    $uploadedRegistryCode = $this->orderNumbers->generateRegistryCode();
                    $path = $this->photoStorage->store($request->file('reprint_file'), $uploadedRegistryCode, $orderNumber);
                    $photoPaths = [$path];
                }
            }

            // Calculate album amount
            $hasNegotiableService = false;
            if (in_array('album', $validated['services'])) {
                $hasNegotiableService = true;
                $album = $validated['album'];
                $product = Product::findOrFail($album['product_id']);
                $quantity = $album['quantity'];
                $albumAmount = $product->price * $quantity;
            }

            // Calculate frame amount
            if (in_array('frame', $validated['services'])) {
                $hasNegotiableService = true;
                $frame = $validated['frame'];
                $product = Product::findOrFail($frame['product_id']);
                $quantity = $frame['quantity'];
                $frameAmount = $product->price * $quantity;
            }

            // Calculate mug amount
            if (in_array('mug', $validated['services'])) {
                $hasNegotiableService = true;
                $mug = $validated['mug'];
                $product = Product::findOrFail($mug['product_id']);
                $quantity = $mug['quantity'];
                $mugAmount = $product->price * $quantity;
            }

            // Calculate total amount
            $totalAmount = $reprintAmount + $albumAmount + $frameAmount + $mugAmount;

            // Handle payment amount
            $paymentAmount = isset($validated['payment_amount'])
                ? (float) $validated['payment_amount']
                : 0.0;

            $discountAmount = (float) ($validated['discount_amount'] ?? 0);
            $effectiveTotal = $totalAmount - $discountAmount;

            $paymentStatus = 'unpaid';
            if ($paymentAmount >= $effectiveTotal) {
                $paymentStatus = 'paid';
            } elseif ($paymentAmount > 0) {
                $paymentStatus = 'partial';
            }

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $customer->id,
                'location_id' => $validated['location_id'],
                'pickup_type' => $validated['delivery_method'] === 'home' ? 'delivery' : 'studio',
                'status' => 'pending',
                'payment_status' => $paymentStatus,
                'total_amount' => $totalAmount,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'amount_paid' => $paymentAmount,
                'paper_type' => $validated['reprint']['paper_type'] ?? 'glossy',
                'special_instructions' => $validated['special_instructions'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items for reprint
            if (in_array('reprint', $validated['services'])) {
                $reprint = $validated['reprint'];
                $product = Product::findOrFail($reprint['product_id']);
                $quantity = $reprint['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $quantity,
                    'photo_paths' => $photoPaths,
                    'reprint_source' => $reprint['source'],
                ]);

                // Handle photo registry attachment
                if ($reprint['source'] === 'upload') {
                    // Create registry for uploaded photo
                    $photoRegistry = PhotoRegistry::create([
                        'registry_code' => $uploadedRegistryCode,
                        'user_id' => $customer->id,
                        'photo_paths' => $photoPaths,
                        'expires_at' => now()->addYear(),
                    ]);
                    $order->photoRegistries()->attach($photoRegistry->id);
                } elseif ($photoRegistry) {
                    // Attach existing registry to this order (shared access)
                    $order->photoRegistries()->attach($photoRegistry->id);
                    // Set original owner if this registry doesn't have one yet
                    if ($photoRegistry->user_id === null) {
                        $photoRegistry->update(['user_id' => $customer->id]);
                    }
                }
            }

            // Handle album service
            if (in_array('album', $validated['services'])) {
                $album = $validated['album'];
                $product = Product::findOrFail($album['product_id']);
                $quantity = $album['quantity'];
                $subtotal = $albumAmount;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                    'photo_paths' => null,
                    'photo_source' => $album['photo_source'] ?? null,
                    'item_specific_notes' => $album['notes'] ?? null,
                ]);
            }

            // Handle frame service
            if (in_array('frame', $validated['services'])) {
                $frame = $validated['frame'];
                $product = Product::findOrFail($frame['product_id']);
                $quantity = $frame['quantity'];
                $subtotal = $frameAmount;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                    'photo_paths' => null,
                    'photo_source' => $frame['photo_source'] ?? null,
                    'item_specific_notes' => $frame['notes'] ?? null,
                ]);
            }

            // Handle mug service
            if (in_array('mug', $validated['services'])) {
                $mug = $validated['mug'];
                $product = Product::findOrFail($mug['product_id']);
                $quantity = $mug['quantity'];
                $subtotal = $mugAmount;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                    'photo_paths' => null,
                    'photo_source' => $mug['photo_source'] ?? null,
                    'item_specific_notes' => $mug['notes'] ?? null,
                ]);
            }

            // Record payment if any
            if ($paymentAmount > 0) {
                Payment::create([
                    'order_id' => $order->id,
                    'amount' => $paymentAmount,
                    'method' => $validated['payment_method'],
                    'reference' => $validated['payment_reference'] ?? null,
                    'paid_at' => now(),
                    'recorded_by' => $request->user()->id,
                ]);
            }

            return $order;
        });

        return redirect()
            ->route('staff.orders.show', $order->order_number)
            ->with('success', "Order {$order->order_number} created successfully!");
    }

    public function searchCustomers(Request $request): JsonResponse
    {
        $query = trim((string) $request->get('q', ''));

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $customers = User::role('customer')
            ->where(function ($q) use ($query): void {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('phone', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'phone', 'email', 'is_walk_in']);

        return response()->json($customers);
    }

    public function getCustomerPhotoRegistries(User $customer): JsonResponse
    {
        // Get Photo IDs owned by this customer
        $ownedIds = PhotoRegistry::where('user_id', $customer->id)->pluck('id');

        // Get Photo IDs attached to this customer's orders (via pivot table)
        $orderIds = $customer->orders()->pluck('id');
        $sharedIds = DB::table('order_photo_registry')
            ->whereIn('order_id', $orderIds)
            ->pluck('photo_registry_id');

        // Combine and get unique IDs
        $allIds = $ownedIds->merge($sharedIds)->unique();

        $registries = PhotoRegistry::whereIn('id', $allIds)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($registry) {
                $firstOrder = $registry->orders()->orderBy('created_at', 'desc')->first();

                return [
                    'id' => $registry->id,
                    'code' => $registry->registry_code,
                    'photos' => $registry->photo_paths ?? [],
                    'created_at' => $registry->created_at->format('M d, Y'),
                    'order_number' => $firstOrder?->order_number,
                ];
            });

        return response()->json($registries);
    }

    public function edit(Order $order): Response
    {
        // Only allow editing for orders awaiting photo
        if (! $order->isAwaitingPhoto()) {
            abort(403, 'Only orders awaiting photo can be edited.');
        }

        $order->load(['user', 'items.product', 'location']);

        $products = Product::where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get(['id', 'name', 'category', 'size_label', 'price', 'description']);

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        // Prepare order data for the form
        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'phone' => $order->user->phone,
                'email' => $order->user->email,
                'is_walk_in' => $order->user->is_walk_in,
            ] : null,
            'location_id' => $order->location_id,
            'delivery_method' => $order->pickup_type === 'delivery' ? 'home' : 'pickup',
            'special_instructions' => $order->special_instructions,
            'notes' => $order->notes,
            'items' => $order->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'category' => $item->product->category,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                ];
            }),
            'paper_type' => $order->paper_type,
            'paper_type' => $order->paper_type,
        ];

        // Get the reprint item if exists
        $reprintItem = $order->items->firstWhere('product.category', 'reprint');
        if ($reprintItem) {
            $orderData['reprint'] = ['product_id' => $reprintItem->product_id,
                'quantity' => $reprintItem->quantity,
            ];
        }

        return Inertia::render('Staff/EditOrder', [
            'order' => $orderData,
            'products' => $products,
            'locations' => $locations,
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        // Only allow editing for orders awaiting photo
        if (! $order->isAwaitingPhoto()) {
            abort(403, 'Only orders awaiting photo can be edited.');
        }

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'delivery_method' => 'required|in:pickup,home',
            'special_instructions' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'reprint_product_id' => 'nullable|exists:products,id',
            'reprint_quantity' => 'nullable|integer|min:1|max:100',
            'reprint_paper_type' => 'nullable|in:glossy,matte',
        ]);

        $order = DB::transaction(function () use ($validated, $order): Order {
            // Update order basics
            $order->update([
                'location_id' => $validated['location_id'],
                'pickup_type' => $validated['delivery_method'] === 'home' ? 'delivery' : 'studio',
                'special_instructions' => $validated['special_instructions'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'paper_type' => $validated['reprint_paper_type'] ?? $order->paper_type,
            ]);

            // Update reprint item if provided
            if (! empty($validated['reprint_product_id'])) {
                $product = Product::findOrFail($validated['reprint_product_id']);
                $quantity = $validated['reprint_quantity'] ?? 1;
                $subtotal = $product->price * $quantity;

                // Find or create order item
                $reprintItem = $order->items()->firstWhere('product_id', $product->id);
                if ($reprintItem) {
                    $reprintItem->update([
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                    ]);
                } else {
                    $order->items()->create([
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                        'photo_paths' => [],
                    ]);
                }

                // Recalculate total
                $totalAmount = $order->items()->sum('subtotal');
                $order->update(['total_amount' => $totalAmount]);
            }

            return $order;
        });

        return redirect()
            ->route('staff.orders.show', $order->order_number)
            ->with('success', "Order {$order->order_number} updated successfully!");
    }
}
