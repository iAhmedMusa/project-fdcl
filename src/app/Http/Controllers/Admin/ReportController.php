<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'sales');
        $dateFrom = Carbon::parse($request->date_from ?? now()->startOfMonth())->startOfDay();
        $dateTo = Carbon::parse($request->date_to ?? now())->endOfDay();
        $locationId = $request->location_id ? (int) $request->location_id : null;

        $reportData = $this->buildReport($type, $dateFrom, $dateTo, $locationId);
        $locations = Location::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Admin/Reports/Index', [
            'report_data' => array_slice($reportData, 0, 100),
            'total_rows' => count($reportData),
            'report_type' => $type,
            'locations' => $locations,
            'summary' => $this->buildSummary($type, $reportData),
            'filters' => $request->only(['type', 'date_from', 'date_to', 'location_id']),
        ]);
    }

    public function download(Request $request)
    {
        $type = $request->get('type', 'sales');
        $format = $request->get('format', 'pdf');
        $dateFrom = Carbon::parse($request->date_from ?? now()->startOfMonth())->startOfDay();
        $dateTo = Carbon::parse($request->date_to ?? now())->endOfDay();
        $locationId = $request->location_id ? (int) $request->location_id : null;

        $reportData = $this->buildReport($type, $dateFrom, $dateTo, $locationId);

        if ($format === 'csv') {
            return $this->downloadCsv($type, $reportData, $dateFrom, $dateTo);
        }

        return $this->downloadPdf($type, $reportData, $dateFrom, $dateTo, $locationId);
    }

    // ── Report builders ───────────────────────────────────────────────────────

    private function buildReport(string $type, Carbon $from, Carbon $to, ?int $locationId): array
    {
        return match ($type) {
            'sales' => $this->salesReport($from, $to, $locationId),
            'appointments' => $this->appointmentReport($from, $to, $locationId),
            'customers' => $this->customerReport($from, $to),
            'products' => $this->productReport($from, $to, $locationId),
            default => [],
        };
    }

    private function salesReport(Carbon $from, Carbon $to, ?int $locationId): array
    {
        return Order::with(['user', 'location'])
            ->withCount('items')
            ->whereBetween('created_at', [$from, $to])
            ->when($locationId, fn ($q) => $q->where('location_id', $locationId))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($o) => [
                'Order #' => $o->order_number,
                'Date' => $o->created_at->format('M d, Y'),
                'Customer' => $o->user->name,
                'Location' => $o->location->name,
                'Items' => $o->items_count,
                'Total (৳)' => number_format($o->total_amount, 0),
                'Paid (৳)' => number_format($o->amount_paid, 0),
                'Balance (৳)' => number_format($o->total_amount - $o->amount_paid, 0),
                'Payment' => ucfirst($o->payment_status),
                'Status' => ucfirst($o->status),
            ])
            ->toArray();
    }

    private function appointmentReport(Carbon $from, Carbon $to, ?int $locationId): array
    {
        return Appointment::with(['user', 'location'])
            ->whereBetween('appointment_date', [$from->toDateString(), $to->toDateString()])
            ->when($locationId, fn ($q) => $q->where('location_id', $locationId))
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get()
            ->map(fn ($a) => [
                'Date' => $a->appointment_date->format('M d, Y'),
                'Time' => date('g:i A', strtotime($a->appointment_time)),
                'Service' => ucfirst(str_replace('_', ' ', $a->service_type)),
                'Name' => $a->customer_name ?? '—',
                'Phone' => $a->customer_phone ?? '—',
                'Location' => $a->location?->name ?? '—',
                'Status' => ucfirst($a->status),
                'Booked By' => $a->user?->name ?? 'Guest',
            ])
            ->toArray();
    }

    private function customerReport(Carbon $from, Carbon $to): array
    {
        return User::role('customer')
            ->whereBetween('created_at', [$from, $to])
            ->withCount('orders')
            ->withSum('orders', 'total_amount')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($u) => [
                'Name' => $u->name,
                'Phone' => $u->phone ?? '—',
                'Type' => $u->is_walk_in ? 'Walk-in' : 'Registered',
                'Orders' => $u->orders_count,
                'Total Spent (৳)' => number_format($u->orders_sum_total_amount ?? 0, 0),
                'Last Order' => $u->orders()->latest()->value('created_at')
                    ? Carbon::parse($u->orders()->latest()->value('created_at'))->format('M d, Y')
                    : '—',
                'Joined' => $u->created_at->format('M d, Y'),
            ])
            ->toArray();
    }

    private function productReport(Carbon $from, Carbon $to, ?int $locationId): array
    {
        return OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select(
                'products.name',
                'products.category',
                DB::raw('COALESCE(products.size_label, "—") as size_label'),
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.subtotal) as revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count')
            )
            ->whereBetween('orders.created_at', [$from, $to])
            ->when($locationId, fn ($q) => $q->where('orders.location_id', $locationId))
            ->groupBy('products.id', 'products.name', 'products.category', 'products.size_label')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($r) => [
                'Product' => $r->name,
                'Category' => ucfirst(str_replace('_', ' ', $r->category)),
                'Size' => $r->size_label,
                'Units Sold' => (int) $r->units_sold,
                'Revenue (৳)' => number_format($r->revenue, 0),
                'Orders' => (int) $r->order_count,
            ])
            ->toArray();
    }

    // ── Summary builders ──────────────────────────────────────────────────────

    private function buildSummary(string $type, array $data): array
    {
        return match ($type) {
            'sales' => [
                'Total Orders' => count($data),
                'Total Revenue' => '৳'.number_format(array_sum(array_map(fn ($r) => (float) str_replace(',', '', $r['Total (৳)']), $data)), 0),
                'Total Collected' => '৳'.number_format(array_sum(array_map(fn ($r) => (float) str_replace(',', '', $r['Paid (৳)']), $data)), 0),
                'Total Outstanding' => '৳'.number_format(array_sum(array_map(fn ($r) => (float) str_replace(',', '', $r['Balance (৳)']), $data)), 0),
            ],
            'appointments' => [
                'Total Scheduled' => count($data),
                'Attended' => count(array_filter($data, fn ($r) => $r['Status'] === 'Attended')),
                'Cancelled' => count(array_filter($data, fn ($r) => $r['Status'] === 'Cancelled')),
                'Attendance Rate' => count($data) > 0
                    ? round(count(array_filter($data, fn ($r) => $r['Status'] === 'Attended')) / count($data) * 100).'%'
                    : '0%',
            ],
            'customers' => [
                'New Customers' => count($data),
                'Walk-in' => count(array_filter($data, fn ($r) => $r['Type'] === 'Walk-in')),
                'Registered' => count(array_filter($data, fn ($r) => $r['Type'] === 'Registered')),
                'Total Revenue' => '৳'.number_format(array_sum(array_map(fn ($r) => (float) str_replace(',', '', $r['Total Spent (৳)']), $data)), 0),
            ],
            'products' => [
                'Products Sold' => count($data),
                'Total Units' => array_sum(array_column($data, 'Units Sold')),
                'Total Revenue' => '৳'.number_format(array_sum(array_map(fn ($r) => (float) str_replace(',', '', $r['Revenue (৳)']), $data)), 0),
                'Top Product' => ! empty($data) ? $data[0]['Product'] : '—',
            ],
            default => [],
        };
    }

    // ── Download helpers ──────────────────────────────────────────────────────

    private function downloadCsv(string $type, array $data, Carbon $from, Carbon $to): StreamedResponse
    {
        $filename = 'FDCL-'.$type.'-report-'.$from->format('Y-m-d').'-to-'.$to->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($data) {
            $out = fopen('php://output', 'w');
            if (! empty($data)) {
                fputcsv($out, array_keys($data[0]));
                foreach ($data as $row) {
                    fputcsv($out, array_values($row));
                }
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function downloadPdf(string $type, array $data, Carbon $from, Carbon $to, ?int $locationId)
    {
        $locationName = $locationId ? (Location::find($locationId)?->name ?? 'All Locations') : 'All Locations';
        $summary = $this->buildSummary($type, $data);
        $filename = 'FDCL-'.$type.'-report-'.$from->format('Y-m-d').'.pdf';

        $pdf = Pdf::loadView('pdf.reports.'.$type, compact('data', 'summary', 'from', 'to', 'locationName'))
            ->setPaper('a4', 'landscape');

        return $pdf->download($filename);
    }
}
