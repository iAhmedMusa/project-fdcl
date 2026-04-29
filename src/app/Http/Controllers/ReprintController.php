<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Http\Controllers\Concerns\HandlesDelivery;
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
    use HandlesDelivery;

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
            'products'      => $products,
            'locations'     => $locations,
            'prefilledCode' => $registryCode,
            'deliveryFees'  => $this->deliveryFees(),
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
                'found'   => false,
                'message' => 'Invalid FDCL Photo ID. Please check and try again.',
            ], 404);
        }

        $existingCustomer = $registry->user;

        return response()->json([
            'found'    => true,
            'registry' => [
                'id'                => $registry->id,
                'code'              => $registry->registry_code,
                'photos'            => array_map(fn ($p) => Storage::url($p), array_filter($registry->photo_paths ?? [])),
                'created_at'        => $registry->created_at->format('M d, Y'),
                'existing_customer' => $existingCustomer ? [
                    'id'    => $existingCustomer->id,
                    'name'  => $existingCustomer->name,
                    'phone' => $existingCustomer->phone,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user            = $request->user();
        $hasRegistryCode = $request->filled('registry_code');
        $orderNumber     = $this->orderNumbers->generate();
        $photoPaths      = [];
        $registry        = null;
        $uploadedRegistryCode = null;

        $product = Product::find($request->input('product_id'));
        $minQty  = $product ? (int) $product->min_quantity : 1;

        $extraRules = [
            'product_id'           => 'required|exists:products,id',
            'quantity'             => "required|integer|min:{$minQty}|max:100",
            'paper_type'           => 'nullable|in:glossy,matte',
            'special_instructions' => 'nullable|string|max:500',
            'bkash_reference'      => 'required|string|max:100',
        ];

        if ($hasRegistryCode) {
            $extraRules['registry_code'] = 'required|string';
        } else {
            $extraRules['photo'] = 'required|image|max:10240';
        }

        $validated = $request->validate(array_merge($this->deliveryRules(), $extraRules));

        $product  = Product::findOrFail($validated['product_id']);
        $delivery = $this->deliveryOrderFields($validated);

        if ($hasRegistryCode) {
            $registry   = PhotoRegistry::where('registry_code', strtoupper($validated['registry_code']))->firstOrFail();
            $photoPaths = $registry->photo_paths;
        } else {
            $uploadedRegistryCode = $this->orderNumbers->generateRegistryCode();
            $path       = $this->photoStorage->store($request->file('photo'), $uploadedRegistryCode, $orderNumber);
            $photoPaths = [$path];
        }

        $productTotal = $product->price * $validated['quantity'];

        $order = DB::transaction(function () use ($user, $product, $validated, $photoPaths, $orderNumber, $delivery, $productTotal, $hasRegistryCode, $registry, $uploadedRegistryCode) {
            $order = Order::create([
                'order_number'         => $orderNumber,
                'user_id'              => $user->id,
                'status'               => 'pending',
                'payment_status'       => 'unpaid',
                'total_amount'         => $productTotal + $delivery['delivery_fee'],
                'amount_paid'          => 0,
                'paper_type'           => $validated['paper_type'] ?? 'glossy',
                'special_instructions' => $validated['special_instructions'] ?? null,
                'bkash_reference'      => $validated['bkash_reference'],
                ...$delivery,
            ]);

            OrderItem::create([
                'order_id'      => $order->id,
                'product_id'    => $product->id,
                'quantity'      => $validated['quantity'],
                'unit_price'    => $product->price,
                'subtotal'      => $productTotal,
                'photo_paths'   => $photoPaths,
                'reprint_source'=> $hasRegistryCode ? 'registry' : 'upload',
            ]);

            if ($hasRegistryCode && $registry) {
                $order->photoRegistries()->attach($registry->id);
                if ($registry->user_id === null) {
                    $registry->update(['user_id' => $user->id]);
                }
            } else {
                $newRegistry = PhotoRegistry::create([
                    'registry_code' => $uploadedRegistryCode,
                    'user_id'       => $user->id,
                    'photo_paths'   => $photoPaths,
                    'expires_at'    => now()->addYear(),
                ]);
                $order->photoRegistries()->attach($newRegistry->id);
            }

            return $order;
        });

        $this->saveAddressToProfile($user, $validated);

        OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));

        return redirect()
            ->route('customer.dashboard')
            ->with('success', "Order {$order->order_number} placed successfully!");
    }
}
