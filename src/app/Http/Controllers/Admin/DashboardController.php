<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Filters ───────────────────────────────────────────────────────────
        $dateFrom = $request->date_from ? Carbon::parse($request->date_from)->startOfDay() : null;
        $dateTo = $request->date_to ? Carbon::parse($request->date_to)->endOfDay() : null;
        $locationId = $request->location_id ? (int) $request->location_id : null;

        $scoped = function ($query) use ($dateFrom, $dateTo, $locationId) {
            if ($dateFrom && $dateTo) {
                $query->whereBetween('created_at', [$dateFrom, $dateTo]);
            }
            if ($locationId) {
                $query->where('location_id', $locationId);
            }

            return $query;
        };

        // ── KPI stats (location-scoped when a location filter is active) ──────
        $statsBase = fn () => $locationId ? Order::where('location_id', $locationId) : Order::query();

        $todayOrders = $statsBase()->whereDate('created_at', today())->count();
        $todayRevenue = $statsBase()->whereDate('created_at', today())->sum('total_amount');
        $pendingOrders = $statsBase()->where('status', 'pending')->count();
        $unpaidBalance = $statsBase()->sum('total_amount') - $statsBase()->sum('amount_paid');

        // Monthly revenue: this month vs last month
        $prevMonth = now()->subMonths(1);
        $mrCurrent = $statsBase()->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total_amount');
        $mrPrev = $statsBase()->whereMonth('created_at', $prevMonth->month)->whereYear('created_at', $prevMonth->year)->sum('total_amount');

        // New customers this month
        $newCustomers = User::role('customer')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Overdue unpaid: unpaid/partial orders older than 7 days
        $overdueUnpaid = $statsBase()->whereIn('payment_status', ['unpaid', 'partial'])
            ->where('created_at', '<', now()->subDays(7))
            ->count();

        // Appointment stats (global)
        $todayAppts = Appointment::whereDate('appointment_date', today())->count();
        $weekAppts = Appointment::whereBetween('appointment_date', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $apptTotal = Appointment::whereMonth('created_at', now()->month)->whereNotIn('status', ['cancelled'])->count();
        $apptAttended = Appointment::whereMonth('created_at', now()->month)->where('status', 'attended')->count();
        $attendanceRate = $apptTotal > 0 ? round(($apptAttended / $apptTotal) * 100) : 0;

        // ── Filter-scoped queries ─────────────────────────────────────────────

        // Last 7 days orders (or within date range if set)
        $weeklyOrders = $scoped(
            Order::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->when(! ($dateFrom && $dateTo), fn ($q) => $q->where('created_at', '>=', now()->subDays(7)))
        )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => ['date' => $item->date, 'count' => $item->count]);

        // Revenue by service category (global filter bar scoped)
        $revenueByService = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('products.category', DB::raw('SUM(order_items.subtotal) as revenue'))
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween('orders.created_at', [$dateFrom, $dateTo]))
            ->when($locationId, fn ($q) => $q->where('orders.location_id', $locationId))
            ->groupBy('products.category')
            ->get()
            ->map(fn ($item) => [
                'category' => ucfirst(str_replace('_', ' ', $item->category)),
                'revenue' => $item->revenue,
            ]);

        // Revenue by service per location — for the independent-filter stat widget.
        // Date-scoped but never location-scoped (the widget handles that client-side).
        $revenueByServiceLocation = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('locations', 'orders.location_id', '=', 'locations.id')
            ->select(
                'products.category',
                'locations.id as location_id',
                'locations.name as location_name',
                DB::raw('SUM(order_items.subtotal) as revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count')
            )
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween('orders.created_at', [$dateFrom, $dateTo]))
            ->groupBy('products.category', 'locations.id', 'locations.name')
            ->get()
            ->map(fn ($r) => [
                'category' => $r->category,
                'location_id' => (int) $r->location_id,
                'location_name' => $r->location_name,
                'revenue' => (float) $r->revenue,
                'order_count' => (int) $r->order_count,
            ]);

        // Orders by location
        $ordersByLocation = Order::join('locations', 'orders.location_id', '=', 'locations.id')
            ->select('locations.name', DB::raw('COUNT(*) as count'))
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween('orders.created_at', [$dateFrom, $dateTo]))
            ->when($locationId, fn ($q) => $q->where('orders.location_id', $locationId))
            ->groupBy('locations.id', 'locations.name')
            ->get()
            ->map(fn ($item) => ['name' => $item->name, 'count' => $item->count]);

        // Recent orders
        $recentOrders = $scoped(Order::with(['user', 'location'])->orderBy('created_at', 'desc')->limit(10))
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at->diffForHumans(),
                'user' => ['name' => $order->user->name],
                'location' => ['name' => $order->location->name],
            ]);

        // 6-month rolling revenue trend (location-scoped only)
        $monthlyTrend = Order::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw('SUM(total_amount) as revenue')
        )
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->when($locationId, fn ($q) => $q->where('location_id', $locationId))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => ['month' => $r->month, 'revenue' => (float) $r->revenue]);

        // Payment method breakdown
        $paymentMethods = Payment::join('orders', 'payments.order_id', '=', 'orders.id')
            ->select('payments.method', DB::raw('SUM(payments.amount) as amount'))
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween('payments.paid_at', [$dateFrom, $dateTo]))
            ->when($locationId, fn ($q) => $q->where('orders.location_id', $locationId))
            ->groupBy('payments.method')
            ->orderByDesc('amount')
            ->get()
            ->map(fn ($r) => ['method' => ucfirst($r->method), 'amount' => (float) $r->amount]);

        // Top 5 products by revenue
        $topProducts = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as quantity'),
                DB::raw('SUM(order_items.subtotal) as revenue')
            )
            ->when($dateFrom && $dateTo, fn ($q) => $q->whereBetween('orders.created_at', [$dateFrom, $dateTo]))
            ->when($locationId, fn ($q) => $q->where('orders.location_id', $locationId))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'name' => $r->name,
                'quantity' => (int) $r->quantity,
                'revenue' => (float) $r->revenue,
            ]);

        // Order status distribution
        $statusCounts = $scoped(Order::query())->select('status', DB::raw('COUNT(*) as count'))->groupBy('status')->pluck('count', 'status')->toArray();
        $orderStatusDist = collect(['pending', 'processing', 'ready', 'delivered', 'cancelled'])
            ->map(fn ($s) => ['status' => ucfirst($s), 'count' => $statusCounts[$s] ?? 0])
            ->values();

        // Locations for filter dropdown
        $locations = Location::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'today_orders' => $todayOrders,
                'today_revenue' => (float) $todayRevenue,
                'pending_orders' => $pendingOrders,
                'unpaid_balance' => (float) $unpaidBalance,
                'monthly_revenue' => (float) $mrCurrent,
                'monthly_revenue_prev' => (float) $mrPrev,
                'new_customers_month' => $newCustomers,
                'overdue_unpaid_count' => $overdueUnpaid,
                'today_appointments' => $todayAppts,
            ],
            'weekly_orders' => $weeklyOrders,
            'revenue_by_service' => $revenueByService,
            'revenue_by_service_location' => $revenueByServiceLocation,
            'orders_by_location' => $ordersByLocation,
            'recent_orders' => $recentOrders,
            'monthly_trend' => $monthlyTrend,
            'payment_methods' => $paymentMethods,
            'top_products' => $topProducts,
            'order_status_dist' => $orderStatusDist,
            'appointment_stats' => [
                'today' => $todayAppts,
                'this_week' => $weekAppts,
                'attendance_rate' => $attendanceRate,
            ],
            'locations' => $locations,
            'filters' => $request->only(['date_from', 'date_to', 'location_id']),
        ]);
    }
}
