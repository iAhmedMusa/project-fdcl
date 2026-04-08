import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ready: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrdersShow({ order }) {
    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number} - Admin`} />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <Link 
                    href="/admin/orders" 
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </Link>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-mono text-xl font-bold text-foreground">{order.order_number}</h1>
                        <p className="text-sm text-muted-foreground">Created {order.created_at}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Customer Info */}
                    <div className="rounded-lg border bg-card p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Customer</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium text-foreground">{order.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="text-foreground">{order.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone</span>
                                <span className="text-foreground">{order.user.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Location</span>
                                <span className="text-foreground">{order.location.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-lg border bg-card p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Payment</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-semibold text-foreground">৳{order.total_amount.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid</span>
                                <span className="text-foreground">৳{order.amount_paid.toFixed(0)}</span>
                            </div>
                            {order.balance > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Balance</span>
                                    <span className="font-semibold text-destructive">৳{order.balance.toFixed(0)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mt-4 rounded-lg border bg-card p-5 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold text-foreground">Items</h2>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-foreground">{item.product_name}</p>
                                    <p className="text-sm text-muted-foreground">{item.size_label}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} ×৳{item.unit_price.toFixed(0)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-foreground">৳{item.subtotal.toFixed(0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}