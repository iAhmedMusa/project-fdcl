<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PhotoRegistry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PhotoStorageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = PhotoRegistry::with(['user', 'orders'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $search = strtoupper($request->search);
            $query->where('registry_code', 'like', "%{$search}%");
        }

        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'expired') {
                $query->where('expires_at', '<', now());
            } elseif ($request->status === 'active') {
                $query->where(function ($q) {
                    $q->whereNull('expires_at')
                        ->orWhere('expires_at', '>=', now());
                });
            }
        }

        if ($request->has('customer') && $request->customer !== 'all') {
            if ($request->customer === 'has_customer') {
                $query->whereNotNull('user_id');
            } elseif ($request->customer === 'no_customer') {
                $query->whereNull('user_id');
            }
        }

        $registries = $query->paginate(20)->through(function ($registry) {
            return [
                'id' => $registry->id,
                'registry_code' => $registry->registry_code,
                'user' => $registry->user ? [
                    'id' => $registry->user->id,
                    'name' => $registry->user->name,
                    'phone' => $registry->user->phone,
                ] : null,
                'orders_count' => $registry->orders->count(),
                'photo_count' => count($registry->photo_paths ?? []),
                'notes' => $registry->notes,
                'created_at' => $registry->created_at->format('M d, Y'),
                'expires_at' => $registry->expires_at?->format('M d, Y'),
                'is_expired' => $registry->expires_at && $registry->expires_at->isPast(),
            ];
        });

        return Inertia::render('Staff/PhotoStorage/Index', [
            'registries' => $registries,
            'filters' => $request->only(['search', 'status', 'customer']),
        ]);
    }

    public function show(string $code): Response
    {
        $registry = PhotoRegistry::with(['user', 'orders.user', 'orders.location'])
            ->where('registry_code', strtoupper($code))
            ->firstOrFail();

        // Get all unique customers who have used this Photo ID
        $allCustomers = collect();
        if ($registry->user) {
            $allCustomers->push($registry->user);
        }
        foreach ($registry->orders as $order) {
            if ($order->user && $allCustomers->where('id', $order->user->id)->isEmpty()) {
                $allCustomers->push($order->user);
            }
        }

        return Inertia::render('Staff/PhotoStorage/Show', [
            'registry' => [
                'id' => $registry->id,
                'registry_code' => $registry->registry_code,
                'photos' => $registry->photo_paths ?? [],
                'notes' => $registry->notes,
                'created_at' => $registry->created_at->format('M d, Y \a\t H:i'),
                'expires_at' => $registry->expires_at?->format('M d, Y'),
                'is_expired' => $registry->expires_at && $registry->expires_at->isPast(),
                'user' => $registry->user ? [
                    'id' => $registry->user->id,
                    'name' => $registry->user->name,
                    'email' => $registry->user->email,
                    'phone' => $registry->user->phone,
                ] : null,
                'all_customers' => $allCustomers->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'email' => $customer->email,
                        'phone' => $customer->phone,
                    ];
                })->unique('id')->values(),
                'orders' => $registry->orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'status' => $order->status,
                        'payment_status' => $order->payment_status,
                        'total_amount' => (float) $order->total_amount,
                        'created_at' => $order->created_at->format('M d, Y'),
                        'user' => $order->user ? [
                            'name' => $order->user->name,
                            'phone' => $order->user->phone,
                        ] : null,
                        'location' => $order->location ? [
                            'name' => $order->location->name,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }
}
