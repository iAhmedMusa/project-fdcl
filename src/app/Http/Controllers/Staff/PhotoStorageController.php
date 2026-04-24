<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PhotoRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
                'photos' => array_map(fn ($p) => Storage::url($p), array_filter($registry->photo_paths ?? [])),
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

    public function download(Request $request): StreamedResponse
    {
        $path = $request->query('path');

        abort_if(empty($path), 400);

        // Strip bucket prefix if a full B2/S3 URL was passed
        $bucket = config('filesystems.disks.s3.bucket');
        if (str_contains($path, $bucket.'/')) {
            $path = substr($path, strpos($path, $bucket.'/') + strlen($bucket.'/'));
        }

        // Strip /storage/ prefix if local public disk URL was passed
        if (str_starts_with($path, '/storage/')) {
            $path = ltrim(substr($path, strlen('/storage/')), '/');
        }

        // Prevent path traversal: reject any .. sequences and require known prefix
        abort_if(str_contains($path, '..'), 400);
        $allowed = false;
        foreach (['orders/', 'photos/', 'old-photo-storage/'] as $prefix) {
            if (str_starts_with($path, $prefix)) {
                $allowed = true;
                break;
            }
        }
        abort_unless($allowed, 400);

        abort_unless(Storage::exists($path), 404);

        $filename = basename($path);
        $mime = Storage::mimeType($path) ?: 'application/octet-stream';

        return Storage::download($path, $filename, [
            'Content-Type' => $mime,
        ]);
    }
}
