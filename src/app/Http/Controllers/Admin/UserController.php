<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('roles', 'location')
            ->withCount('orders')
            ->orderBy('created_at', 'desc');

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name, email, or phone
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20)->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? 'Not provided',
                'address' => $user->address ?? 'Not provided',
                'is_active' => $user->is_active,
                'role' => $user->roles->first()?->name ?? 'customer',
                'location' => $user->location ? ['id' => $user->location->id, 'name' => $user->location->name] : null,
                'created_at' => $user->created_at->format('M d, Y'),
                'orders_count' => $user->orders_count,
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'is_active', 'search']),
            'locations' => Location::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function show(User $user): Response
    {
        $user->load('roles');

        $orders = Order::with(['location', 'items.product', 'payments'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => (float) $order->total_amount,
                    'created_at' => $order->created_at->format('M d, Y'),
                    'location' => [
                        'name' => $order->location->name,
                    ],
                    'items_count' => $order->items->count(),
                ];
            });

        $photoRegistries = $user->photoRegistries()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($registry) {
                $firstOrder = $registry->orders()->orderBy('created_at', 'desc')->first();

                return [
                    'registry_code' => $registry->registry_code,
                    'created_at' => $registry->created_at->format('M d, Y'),
                    'order_number' => $firstOrder?->order_number,
                ];
            });

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? 'Not provided',
                'address' => $user->address ?? 'Not provided',
                'is_active' => $user->is_active,
                'role' => $user->roles->first()?->name ?? 'customer',
                'created_at' => $user->created_at->format('M d, Y H:i'),
            ],
            'orders' => $orders,
            'photo_registries' => $photoRegistries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/'],
            'address' => 'nullable|string|max:500',
            'role' => 'required|in:staff,admin',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        $validated['phone'] = User::normalizePhone($validated['phone'] ?? null);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'password' => Hash::make('Staff@1234'),
            'is_active' => true,
            'location_id' => $validated['location_id'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created. Default password: Staff@1234 — ask them to change it after first login.');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        // Prevent deactivating yourself
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $user->is_active = ! $user->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "User {$status} successfully.");
    }
}
