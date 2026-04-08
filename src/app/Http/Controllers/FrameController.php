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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FrameController extends Controller
{
    public function __construct(
        private OrderNumberGenerator $orderNumbers,
        private PhotoStorage $photoStorage,
    ) {}

    public function create(Request $request): Response
    {
        $products = Product::where('category', 'frame')
            ->where('is_active', true)
            ->get();

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        return Inertia::render('Order/Frame', [
            'products' => $products,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $orderNumber = $this->orderNumbers->generate();

        $hasPhotoUpload = $request->hasFile('photo');

        if ($hasPhotoUpload) {
            $validated = $request->validate([
                'photo' => 'required|image|max:10240',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:100',
                'location_id' => 'required|exists:locations,id',
                'item_specific_notes' => 'nullable|string|max:1000',
            ]);

            $registryCode = $this->orderNumbers->generateRegistryCode();
            $product = Product::findOrFail($validated['product_id']);
            $photoPath = $this->photoStorage->store($request->file('photo'), $registryCode, $orderNumber);
            $photoPaths = [$photoPath];
        } else {
            $validated = $request->validate([
                'photo_source' => 'required|string|max:1000',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:100',
                'location_id' => 'required|exists:locations,id',
                'item_specific_notes' => 'nullable|string|max:1000',
            ]);

            $product = Product::findOrFail($validated['product_id']);
            $photoPaths = [];
        }

        $order = DB::transaction(function () use ($user, $product, $validated, $orderNumber, $hasPhotoUpload, $photoPaths, &$registryCode) {
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
                'special_instructions' => null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
                'subtotal' => $product->price * $validated['quantity'],
                'photo_paths' => $photoPaths ?: null,
                'photo_source' => $validated['photo_source'] ?? null,
                'item_specific_notes' => $validated['item_specific_notes'] ?? null,
            ]);

            if ($hasPhotoUpload && $registryCode) {
                $registry = PhotoRegistry::create([
                    'registry_code' => $registryCode,
                    'user_id' => $user->id,
                    'photo_paths' => $photoPaths,
                    'expires_at' => now()->addYear(),
                ]);

                $order->photoRegistries()->attach($registry->id);
            }

            return $order;
        });

        OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
