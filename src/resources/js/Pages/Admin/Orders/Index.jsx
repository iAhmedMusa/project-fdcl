import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ready: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PAYMENT_COLORS = {
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function OrdersIndex({ orders }) {
    return (
        <AdminLayout>
            <Head title="All Orders - Admin Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <h1 className="text-lg font-semibold text-foreground">All Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        All orders across both locations with full control.
                    </p>
                </div>

                <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Order #</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="transition-colors hover:bg-accent/50">
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <Link 
                                            href={`/admin/orders/${order.order_number}`} 
                                            className="font-mono text-sm font-semibold text-primary hover:underline"
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
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                        </span>
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