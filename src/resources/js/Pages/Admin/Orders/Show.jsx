import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_STYLES = {
    pending:    { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', dot: 'bg-gray-400' },
    processing: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    ready:      { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    delivered:  { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
    cancelled:  { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
};

function InfoRow({ label, value, highlight = false }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-sm ${highlight ? 'font-semibold text-foreground' : 'text-foreground'}`}>{value}</span>
        </div>
    );
}

export default function OrdersShow({ order }) {
    const s = STATUS_STYLES[order.status] ?? { badge: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };

    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number} - Admin`} />

            <div className="space-y-6">
                {/* Back nav */}
                <Link
                    href="/admin/orders"
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </Link>

                {/* Order header */}
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order</p>
                        <h1 className="mt-1 font-mono text-2xl font-bold text-foreground">{order.order_number}</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">Created {order.created_at}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${s.badge}`}>
                        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                {/* Customer + Payment */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Customer</h2>
                        <div>
                            <InfoRow label="Name" value={order.user.name} highlight />
                            <InfoRow label="Email" value={order.user.email} />
                            <InfoRow label="Phone" value={order.user.phone ?? '—'} />
                            <InfoRow label="Location" value={order.location.name} />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Payment</h2>
                        <div>
                            <InfoRow label="Total" value={`৳${order.total_amount.toFixed(0)}`} highlight />
                            <InfoRow label="Paid" value={`৳${order.amount_paid.toFixed(0)}`} />
                            {order.balance > 0 && (
                                <div className="flex items-center justify-between py-2.5">
                                    <span className="text-sm text-muted-foreground">Balance due</span>
                                    <span className="text-sm font-bold text-red-600">৳{order.balance.toFixed(0)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h2 className="text-sm font-semibold text-foreground">Order Items</h2>
                    </div>
                    <div className="divide-y divide-border/60 px-5">
                        {order.items.filter(item => item.category !== 'studio_fee').map((item) => (
                            <div key={item.id} className="flex items-start justify-between py-4">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                                    {item.size_label && (
                                        <p className="mt-0.5 text-xs text-muted-foreground">{item.size_label}</p>
                                    )}
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {item.quantity} × ৳{item.unit_price.toFixed(0)}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-foreground">৳{item.subtotal.toFixed(0)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3.5">
                        <span className="text-sm font-semibold text-muted-foreground">Total</span>
                        <span className="text-sm font-bold text-foreground">৳{order.total_amount.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
