<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PhotoRegistry;
use App\Models\Product;
use App\Services\OrderNumberGenerator;
use App\Services\PhotoStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReprintController extends Controller
{
    public function __construct(
        private OrderNumberGenerator $orderNumbers,
        private PhotoStorage $photoStorage,
    ) {}

    public function create(Request $request): Response
    {
        $products = Product::where('category', 'reprint')
            ->where('is_active', true)
            ->get();

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        $registryCode = $request->query('code');

        return Inertia::render('Order/PhotoReprint', [
            'products' => $products,
            'locations' => $locations,
            'prefilledCode' => $registryCode,
        ]);
    }

    public function lookup(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = strtoupper(trim($request->code));

        $registry = PhotoRegistry::with(['user', 'orders'])
            ->where('registry_code', $code)
            ->first();

        if (! $registry) {
            return response()->json([
                'found' => false,
                'message' => 'Invalid FDCL Photo ID. Please check and try again.',
            ], 404);
        }

        $existingCustomer = $registry->user;

        return response()->json([
            'found' => true,
            'registry' => [
                'id' => $registry->id,
                'code' => $registry->registry_code,
                'photos' => array_map(fn ($p) => Storage::url($p), array_filter($registry->photo_paths ?? [])),
                'created_at' => $registry->created_at->format('M d, Y'),
                'existing_customer' => $existingCustomer ? [
                    'id' => $existingCustomer->id,
                    'name' => $existingCustomer->name,
                    'phone' => $existingCustomer->phone,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $hasRegistryCode = $request->filled('registry_code');
        $orderNumber = $this->orderNumbers->generate();
        $uploadedRegistryCode = null;
        $photoPaths = [];
        $registry = null;

        if ($hasRegistryCode) {
            $validated = $request->validate([
                'registry_code' => 'required|string',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:4|max:100',
                'location_id' => 'required|exists:locations,id',
                'paper_type' => 'nullable|in:glossy,matte',
                'special_instructions' => 'nullable|string|max:500',
            ]);

            $registry = PhotoRegistry::where('registry_code', strtoupper($validated['registry_code']))->firstOrFail();
            $product = Product::findOrFail($validated['product_id']);
            $photoPaths = $registry->photo_paths;
        } else {
            $validated = $request->validate([
                'photo' => 'required|image|max:10240',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:4|max:100',
                'location_id' => 'required|exists:locations,id',
                'paper_type' => 'nullable|in:glossy,matte',
                'special_instructions' => 'nullable|string|max:500',
            ]);

            $uploadedRegistryCode = $this->orderNumbers->generateRegistryCode();
            $product = Product::findOrFail($validated['product_id']);
            $path = $this->photoStorage->store($request->file('photo'), $uploadedRegistryCode, $orderNumber);
            $photoPaths = [$path];
        }

        $order = DB::transaction(function () use ($user, $product, $validated, $photoPaths, $orderNumber, $hasRegistryCode, $registry, $uploadedRegistryCode) {
            $location = Location::findOrFail($validated['location_id']);

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'location_id' => $location->id,
                'pickup_type' => 'studio',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_amount' => $product->price * $validated['quantity'],
                'amount_paid' => 0,
                'paper_type' => $validated['paper_type'] ?? 'glossy',
                'special_instructions' => $validated['special_instructions'] ?? null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
                'subtotal' => $product->price * $validated['quantity'],
                'photo_paths' => $photoPaths,
                'reprint_source' => $hasRegistryCode ? 'registry' : 'upload',
            ]);

            if ($hasRegistryCode && $registry) {
                // Attach existing registry to this order (auto-share for customers)
                $order->photoRegistries()->attach($registry->id);
                // Set original owner if this registry doesn't have one yet
                if ($registry->user_id === null) {
                    $registry->update(['user_id' => $user->id]);
                }
            } else {
                // Create a new registry entry for the uploaded photo
                $newRegistry = PhotoRegistry::create([
                    'registry_code' => $uploadedRegistryCode,
                    'user_id' => $user->id,
                    'photo_paths' => $photoPaths,
                    'expires_at' => now()->addYear(),
                ]);
                $order->photoRegistries()->attach($newRegistry->id);
            }

            return $order;
        });

        OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
