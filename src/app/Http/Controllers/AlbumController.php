<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Http\Controllers\Concerns\HandlesDelivery;
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
    use HandlesDelivery;

    public function __construct(
        private OrderNumberGenerator $orderNumbers,
    ) {}

    public function index(Request $request): Response
    {
        $products = Product::where('category', 'album')
            ->where('is_active', true)
            ->get();

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        return Inertia::render('Landing/Album', [
            'products'     => $products,
            'locations'    => $locations,
            'deliveryFees' => $this->deliveryFees(),
        ]);
    }

    public function create(Request $request): Response
    {
        $products = Product::where('category', 'album')
            ->where('is_active', true)
            ->get();

        $locations = Location::where('is_active', true)
            ->get(['id', 'name', 'address']);

        return Inertia::render('Order/Album', [
            'products'     => $products,
            'locations'    => $locations,
            'deliveryFees' => $this->deliveryFees(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate(array_merge($this->deliveryRules(), [
            'product_id'           => 'required|exists:products,id',
            'quantity'             => 'required|integer|min:1|max:100',
            'photo_source'         => 'nullable|string|max:1000',
            'item_specific_notes'  => 'nullable|string|max:1000',
            'special_instructions' => 'nullable|string|max:500',
            'bkash_reference'      => 'required|string|max:100',
        ]));

        $orderNumber = $this->orderNumbers->generate();
        $delivery    = $this->deliveryOrderFields($validated);
        $product     = Product::findOrFail($validated['product_id']);
        $productTotal = $product->price * $validated['quantity'];

        $order = DB::transaction(function () use ($user, $validated, $orderNumber, $delivery, $product, $productTotal) {
            $order = Order::create([
                'order_number'          => $orderNumber,
                'user_id'               => $user->id,
                'status'                => 'pending',
                'payment_status'        => 'unpaid',
                'total_amount'          => $productTotal + $delivery['delivery_fee'],
                'amount_paid'           => 0,
                'special_instructions'  => $validated['special_instructions'] ?? null,
                'bkash_reference'       => $validated['bkash_reference'],
                ...$delivery,
            ]);

            OrderItem::create([
                'order_id'            => $order->id,
                'product_id'          => $product->id,
                'quantity'            => $validated['quantity'],
                'unit_price'          => $product->price,
                'subtotal'            => $productTotal,
                'photo_paths'         => null,
                'photo_source'        => $validated['photo_source'] ?? null,
                'item_specific_notes' => $validated['item_specific_notes'] ?? null,
            ]);

            return $order;
        });

        $this->saveAddressToProfile($user, $validated);

        OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
