import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const STATUS_COLORS = {
    pending: 'bg-secondary text-secondary-foreground',
    processing: 'bg-blue-50 text-blue-700',
    ready: 'bg-amber-50 text-amber-700',
    out_for_delivery: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
};

const PAYMENT_COLORS = {
    unpaid: 'bg-red-50 text-red-700',
    partial: 'bg-amber-50 text-amber-700',
    paid: 'bg-green-50 text-green-700',
};

const STUDIO_TIMELINE = ['pending', 'processing', 'ready', 'delivered'];
const DELIVERY_TIMELINE = ['pending', 'processing', 'ready', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
    pending: 'Placed', processing: 'Processing', ready: 'Ready',
    out_for_delivery: 'On the Way', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrderDetail({ auth, order, invoiceToken }) {
    const isDeliveryOrder = order.pickup_type === 'delivery';
    const STATUS_TIMELINE = isDeliveryOrder ? DELIVERY_TIMELINE : STUDIO_TIMELINE;
    const currentIndex = STATUS_TIMELINE.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <CustomerLayout>
            <Head title={`Order ${order.order_number} - FDCL`} />

            <Link
                href={route('customer.dashboard')}
                className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
            </Link>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-mono text-xl font-bold">{order.order_number}</h1>
                    <p className="text-sm text-muted-foreground">Placed on {order.created_at}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                </span>
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
                <div className="mb-5 rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                        {STATUS_TIMELINE.map((status, index) => {
                            const isCompleted = index <= currentIndex;
                            const isCurrent = index === currentIndex;
                            return (
                                <div key={status} className="flex flex-1 items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                            isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        } ${isCurrent ? 'ring-2 ring-primary/20' : ''}`}>
                                            {isCompleted ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`mt-1 text-[10px] font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {STATUS_LABELS[status]}
                                        </span>
                                    </div>
                                    {index < STATUS_TIMELINE.length - 1 && (
                                        <div className={`mx-1.5 h-px flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-border'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isCancelled && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Order Cancelled</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">If you have questions, call us at 01713140768.</p>
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-5">
                {/* Order Items — 3 cols */}
                <div className="rounded-lg border bg-card p-4 lg:col-span-3">
                    <h2 className="text-sm font-semibold">Order Items</h2>
                    <div className="mt-3 space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{item.product_name}</p>
                                        <p className="text-xs text-muted-foreground">{item.size_label} — Qty: {item.quantity} x {item.unit_price.toFixed(0)}</p>
                                    </div>
                                    <span className="text-sm font-semibold">{item.subtotal.toFixed(0)}</span>
                                </div>
                                {item.photo_paths.length > 0 && (
                                    <div className="mt-2 flex gap-1.5">
                                        {item.photo_paths.map((path, i) => (
                                            <div
                                                key={i}
                                                className="h-12 w-12 rounded border bg-muted"
                                                // style={{ backgroundImage: `url(/storage/${path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                                style={{ backgroundImage: `url(${path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                            />
                                        ))}
                                    </div>
                                )}
                                {item.photo_source && (
                                    <div className="mt-2 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2">
                                        <div className="flex items-start gap-2">
                                            <svg className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m4.243 4.243L6.75 7.5l4.243 4.243m4.5-4.5L21.75 7.5l-4.243 4.243" />
                                            </svg>
                                            <div className="flex-1">
                                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Photo Source</span>
                                                {item.photo_source.match(/^https?:\/\//) ? (
                                                    <a 
                                                        href={item.photo_source} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 dark:text-blue-400 mt-0.5 block hover:underline break-all"
                                                    >
                                                        {item.photo_source}
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-blue-900 dark:text-blue-100 mt-0.5">{item.photo_source}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {item.item_specific_notes && (
                                    <div className="mt-2 rounded-md bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-3 py-2">
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                            Notes for {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Item'}
                                        </span>
                                        <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">{item.item_specific_notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex justify-between border-t pt-3 text-sm font-semibold">
                        <span>Total</span>
                        <span>{order.total_amount.toFixed(0)}</span>
                    </div>
                </div>

                {/* Right column — 2 cols */}
                <div className="space-y-4 lg:col-span-2">
                    {/* Location / Delivery */}
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="text-sm font-semibold">Delivery Method</h2>
                        <div className="mt-2 rounded-md bg-muted p-3">
                            {isDeliveryOrder ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3" />
                                        </svg>
                                        <span className="text-sm font-medium">Home Delivery</span>
                                        {order.delivery_type && (
                                            <span className="rounded bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400 capitalize">
                                                {order.delivery_type}
                                            </span>
                                        )}
                                    </div>
                                    {order.delivery_address && (
                                        <p className="text-xs text-muted-foreground">{order.delivery_address}</p>
                                    )}
                                    {order.steadfast_tracking_code && (
                                        <div className="mt-2 rounded border border-primary/20 bg-primary/5 px-3 py-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Steadfast Tracking</p>
                                            <p className="mt-0.5 font-mono text-sm font-bold">{order.steadfast_tracking_code}</p>
                                            {order.steadfast_delivery_status && (
                                                <p className="mt-0.5 text-xs text-muted-foreground capitalize">{order.steadfast_delivery_status.replace(/_/g, ' ')}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span className="text-sm font-medium">Studio Pickup</span>
                                    </div>
                                    {order.location?.name && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-foreground">{order.location.name}</p>
                                            <p className="text-xs text-muted-foreground">{order.location.address}</p>
                                            {order.location.google_maps_url && (
                                                <a href={order.location.google_maps_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex text-xs text-primary hover:text-primary/80">
                                                    Open in Maps
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="text-sm font-semibold">Payment</h2>
                        <div className="mt-2 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-medium">{order.total_amount.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid</span>
                                <span className="font-medium text-green-600">{order.amount_paid.toFixed(0)}</span>
                            </div>
                            {order.balance > 0 && (
                                <div className="flex justify-between border-t pt-1.5">
                                    <span className="text-muted-foreground">Balance</span>
                                    <span className="font-medium text-destructive">{order.balance.toFixed(0)}</span>
                                </div>
                            )}
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                        </div>
                        {order.payments.length > 0 && (
                            <div className="mt-3 border-t pt-3">
                                <p className="text-xs font-semibold text-muted-foreground">History</p>
                                <div className="mt-1 space-y-1">
                                    {order.payments.map((p) => (
                                        <div key={p.id} className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{p.paid_at} — {p.method}</span>
                                            <span className="font-medium">{p.amount.toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Photo ID */}
                    {order.photo_registry && (
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">FDCL Photo ID</p>
                            <p className="mt-1 font-mono text-xl font-bold">{order.photo_registry.registry_code}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Use this code to reorder anytime.</p>
                            <Link
                                href={`/order/reprint?code=${order.photo_registry.registry_code}`}
                                className="mt-2 inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Reorder
                            </Link>
                        </div>
                    )}

                    {order.special_instructions && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="text-sm font-semibold">Special Instructions</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{order.special_instructions}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <a
                    href={invoiceToken ? route('invoice.public', invoiceToken) : route('orders.invoice', order.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoice
                </a>
            </div>
        </CustomerLayout>
    );
}
