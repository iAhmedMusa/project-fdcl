<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\OrderNumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function __construct(
        private OrderNumberGenerator $orderNumbers,
    ) {}

    public function create(Request $request): Response
    {
        $products = Product::where('category', 'album')
            ->where('is_active', true)
            ->get();

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        return Inertia::render('Order/Album', [
            'products' => $products,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100',
            'location_id' => 'required|exists:locations,id',
            'photo_source' => 'nullable|string|max:1000',
            'item_specific_notes' => 'nullable|string|max:1000',
            'special_instructions' => 'nullable|string|max:500',
        ]);

        $orderNumber = $this->orderNumbers->generate();

        $order = DB::transaction(function () use ($user, $validated, $orderNumber) {
            $location = Location::findOrFail($validated['location_id']);
            $product = Product::findOrFail($validated['product_id']);

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'location_id' => $location->id,
                'pickup_type' => 'studio',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_amount' => $product->price * $validated['quantity'],
                'amount_paid' => 0,
                'special_instructions' => $validated['special_instructions'] ?? null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
                'subtotal' => $product->price * $validated['quantity'],
                'photo_paths' => null,
                'photo_source' => $validated['photo_source'] ?? null,
                'item_specific_notes' => $validated['item_specific_notes'] ?? null,
            ]);

            return $order;
        });

        OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
