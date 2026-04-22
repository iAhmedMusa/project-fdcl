<?php

declare(strict_types=1);

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PhotoRegistry;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    private const DEFAULT_PASSWORD = 'Customer@1234';

    public function index(Request $request): Response
    {
        $query = User::role('customer')
            ->withCount('orders')
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filter === 'walk_in') {
            $query->where('is_walk_in', true);
        } elseif ($request->filter === 'login_enabled') {
            $query->where('is_active', true)
                ->where('email', 'not like', '%@fdcl.local');
        } elseif ($request->filter === 'login_disabled') {
            $query->where(function ($q): void {
                $q->where('is_active', false)
                    ->orWhere('email', 'like', '%@fdcl.local');
            });
        }

        $customers = $query->paginate(20)->through(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
            'email' => $user->email,
            'is_walk_in' => $user->is_walk_in,
            'is_active' => $user->is_active,
            'has_login' => ! str_ends_with($user->email ?? '', '@fdcl.local'),
            'orders_count' => $user->orders_count,
            'created_at' => $user->created_at->format('M d, Y'),
        ]);

        return Inertia::render('Staff/Customers/Index', [
            'customers' => $customers,
            'filters' => (object) $request->only(['search', 'filter']),
        ]);
    }

    public function show(User $customer): Response
    {
        abort_if(! $customer->hasRole('customer'), 403);

        $orders = Order::with('location')
            ->where('user_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'amount_paid' => (float) $order->amount_paid,
                'created_at' => $order->created_at->format('M d, Y'),
                'location' => ['name' => $order->location?->name ?? '—'],
            ]);

        // Get Photo IDs owned by this customer
        $ownedIds = PhotoRegistry::where('user_id', $customer->id)->pluck('id');

        // Get Photo IDs attached to this customer's orders (via pivot table)
        $orderIds = $customer->orders()->pluck('id');
        $sharedIds = DB::table('order_photo_registry')
            ->whereIn('order_id', $orderIds)
            ->pluck('photo_registry_id');

        // Combine and get unique IDs, then fetch
        $allIds = $ownedIds->merge($sharedIds)->unique();

        $photoRegistries = PhotoRegistry::whereIn('id', $allIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'code' => $r->registry_code,
                'photos' => array_map(fn ($p) => Storage::url($p), array_filter($r->photo_paths ?? [])),
                'notes' => $r->notes,
                'created_at' => $r->created_at->format('M d, Y'),
                'expires_at' => $r->expires_at?->format('M d, Y'),
                'is_expired' => $r->expires_at && $r->expires_at->isPast(),
                'is_shared' => $r->user_id !== null && $r->user_id !== $customer->id,
            ]);

        return Inertia::render('Staff/Customers/Show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'address' => $customer->address,
                'is_walk_in' => $customer->is_walk_in,
                'is_active' => $customer->is_active,
                'has_login' => ! str_ends_with($customer->email, '@fdcl.local'),
                'created_at' => $customer->created_at->format('M d, Y'),
            ],
            'orders' => $orders,
            'photoRegistries' => $photoRegistries,
        ]);
    }

    public function update(Request $request, User $customer): RedirectResponse
    {
        abort_if(! $customer->hasRole('customer'), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/', Rule::unique('users', 'phone')->ignore($customer->id)],
            'email' => ['nullable', 'email', 'max:150', Rule::unique('users', 'email')->ignore($customer->id)],
            'address' => 'nullable|string|max:300',
        ]);

        $validated['phone'] = User::normalizePhone($validated['phone']);

        // If email is being changed away from a placeholder, keep it
        if (empty($validated['email'])) {
            unset($validated['email']);
        }

        $customer->update($validated);

        return back()->with('success', 'Customer information updated.');
    }

    public function enableLogin(Request $request, User $customer): RedirectResponse
    {
        abort_if(! $customer->hasRole('customer'), 403);

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($customer->id)],
        ]);

        $customer->update([
            'email' => $validated['email'],
            'password' => Hash::make(self::DEFAULT_PASSWORD),
            'is_active' => true,
            'is_walk_in' => $customer->is_walk_in, // preserve walk-in flag
        ]);

        return back()->with('success', 'Login enabled. Customer can sign in with their email and the default password.');
    }

    public function resetPassword(User $customer): RedirectResponse
    {
        abort_if(! $customer->hasRole('customer'), 403);

        if (str_ends_with($customer->email, '@fdcl.local')) {
            return back()->with('error', 'Enable login first before resetting the password.');
        }

        $customer->update([
            'password' => Hash::make(self::DEFAULT_PASSWORD),
        ]);

        return back()->with('success', 'Password reset to the default.');
    }

    public function toggleActive(User $customer): RedirectResponse
    {
        abort_if(! $customer->hasRole('customer'), 403);

        if (str_ends_with($customer->email, '@fdcl.local')) {
            return back()->with('error', 'Enable login access first before toggling it.');
        }

        $customer->update(['is_active' => ! $customer->is_active]);

        $status = $customer->is_active ? 'enabled' : 'disabled';

        return back()->with('success', "Login access {$status}.");
    }
}
