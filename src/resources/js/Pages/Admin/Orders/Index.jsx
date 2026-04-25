import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_STYLES = {
    pending:    { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', dot: 'bg-gray-400' },
    processing: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    ready:      { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    delivered:  { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
    cancelled:  { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
};

const PAYMENT_STYLES = {
    unpaid:  { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
    partial: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    paid:    { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
};

function StatusBadge({ status, map }) {
    const s = map[status] ?? { badge: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function OrdersIndex({ orders }) {
    return (
        <AdminLayout>
            <Head title="All Orders - Admin Panel" />

            <div className="space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-foreground">Orders</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">All orders across both locations.</p>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order #</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</th>
                                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="group transition-colors hover:bg-muted/30">
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <Link
                                            href={`/admin/orders/${order.order_number}`}
                                            className="cursor-pointer font-mono text-sm font-bold text-primary hover:underline"
                                        >
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <div className="text-sm font-medium text-foreground">{order.user.name}</div>
                                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">{order.location.name}</td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                        <span className="text-sm font-semibold text-foreground">৳{order.total_amount.toFixed(0)}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <StatusBadge status={order.payment_status} map={PAYMENT_STYLES} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <StatusBadge status={order.status} map={STATUS_STYLES} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">{order.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
