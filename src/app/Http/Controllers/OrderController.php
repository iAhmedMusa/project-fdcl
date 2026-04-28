<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PhotoRegistry;
use App\Models\Product;
use App\Services\OrderNumberGenerator;
use App\Services\PhotoStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderNumberGenerator $orderNumbers,
        private PhotoStorage $photoStorage,
    ) {}

    public function create(): Response
    {
        $products = Product::where('is_active', true)
            ->get()
            ->groupBy('category')
            ->map(fn ($group) => $group->values());

        $locations = Location::where('is_active', true)->get(['id', 'name', 'address']);

        return Inertia::render('Order/Wizard', [
            'products' => $products,
            'locations' => $locations,
        ]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $order = DB::transaction(function () use ($validated, $user) {
            $orderNumber = $this->orderNumbers->generate();

            // Resolve products and compute total
            $itemsData = collect($validated['items'])->map(function ($item) {
                $product = Product::findOrFail($item['product_id']);

                return [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                    'photos' => $item['photos'] ?? [],
                ];
            });

            $totalAmount = $itemsData->sum('subtotal');

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'location_id' => $validated['location_id'],
                'pickup_type' => $validated['pickup_type'] ?? 'studio',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_amount' => $totalAmount,
                'amount_paid' => 0,
                'special_instructions' => $validated['special_instructions'] ?? null,
                'bkash_reference' => $validated['bkash_reference'],
            ]);

            $allPhotoPaths = [];
            $hasPhotoStudio = false;
            $photoStudioRegistryCode = null;

            foreach ($itemsData as $itemData) {
                $photoPaths = [];

                if ($itemData['product']->category === 'photo_studio' && count($itemData['photos']) > 0) {
                    $photoStudioRegistryCode = $this->orderNumbers->generateRegistryCode();
                    foreach ($itemData['photos'] as $photo) {
                        $path = $this->photoStorage->store($photo, $photoStudioRegistryCode, $orderNumber);
                        $photoPaths[] = $path;
                        $allPhotoPaths[] = $path;
                    }
                } else {
                    foreach ($itemData['photos'] as $photo) {
                        $path = $this->photoStorage->storeWithOrderNumber($photo, $orderNumber);
                        $photoPaths[] = $path;
                        $allPhotoPaths[] = $path;
                    }
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product']->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'subtotal' => $itemData['subtotal'],
                    'photo_paths' => $photoPaths ?: null,
                ]);

                if ($itemData['product']->category === 'photo_studio') {
                    $hasPhotoStudio = true;
                }
            }

            // Create PhotoRegistry for photo_studio orders
            if ($hasPhotoStudio && count($allPhotoPaths) > 0) {
                PhotoRegistry::create([
                    'registry_code' => $photoStudioRegistryCode,
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'photo_paths' => $allPhotoPaths,
                ]);
            }

            return $order;
        });

        OrderPlaced::dispatch($order);

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
