import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const STATUS_COLORS = {
    pending: 'bg-secondary text-secondary-foreground',
    processing: 'bg-blue-50 text-blue-700',
    ready: 'bg-amber-50 text-amber-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
};

const PAYMENT_COLORS = {
    unpaid: 'bg-red-50 text-red-700',
    partial: 'bg-amber-50 text-amber-700',
    paid: 'bg-green-50 text-green-700',
};

export default function Dashboard({ auth, orders, photoRegistries }) {
    return (
        <CustomerLayout>
            <Head title="My Orders - FDCL" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold">Hello, {auth.user.name}</h1>
                    <p className="text-sm text-muted-foreground">Your orders at Focus Digital Color Lab.</p>
                </div>
                <Link
                    href="/order"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Order
                </Link>
            </div>

            {/* ── My Photos ──────────────────────────────────────────── */}
            {photoRegistries?.length > 0 && (
                <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">My Studio Photos</h2>
                        <Link
                            href="/order/reprint"
                            className="text-xs text-primary hover:underline"
                        >
                            Search by ID
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {photoRegistries.map((registry) => (
                            <div
                                key={registry.code}
                                className="rounded-lg border bg-card p-4"
                            >
                                {/* Photo thumbnails */}
                                {registry.photos.length > 0 && (
                                    <div className="mb-3 flex gap-1.5">
                                        {registry.photos.slice(0, 3).map((photo, i) => (
                                            <div
                                                key={i}
                                                className="h-16 w-14 rounded border bg-gray-100 object-cover overflow-hidden"
                                                style={{
                                                    // backgroundImage: `url(/storage/${photo})`,
                                                    backgroundImage: `url(${photo})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                        ))}
                                        {registry.photos.length > 3 && (
                                            <div className="flex h-16 w-14 items-center justify-center rounded border bg-gray-50 text-xs text-gray-400">
                                                +{registry.photos.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-mono text-xs font-semibold text-primary">{registry.code}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{registry.created_at}</p>
                                        {registry.notes && (
                                            <p className="mt-0.5 truncate text-xs text-gray-500">{registry.notes}</p>
                                        )}
                                        {registry.is_expired && (
                                            <p className="mt-0.5 text-xs text-red-500">Expired</p>
                                        )}
                                    </div>
                                    {!registry.is_expired && (
                                        <Link
                                            href={`/order/reprint?code=${registry.code}`}
                                            className="shrink-0 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Reprint
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Orders ─────────────────────────────────────────────── */}
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-gray-900">My Orders</h2>
            </div>

            {orders.data.length === 0 ? (
                <div className="rounded-lg border bg-card p-10 text-center">
                    <svg className="mx-auto h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                    <h3 className="mt-3 text-sm font-semibold">No orders yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Place your first order to get started.</p>
                    <Link
                        href="/order"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Order Your Photo
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {orders.data.map((order) => (
                        <Link
                            key={order.id}
                            href={route('customer.orders.show', order.order_number)}
                            className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-sm font-semibold text-primary">
                                            {order.order_number}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_COLORS[order.payment_status]}`}>
                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span>{order.created_at}</span>
                                        {order.location && <span>{order.location.name}</span>}
                                        {order.items_summary && <span>{order.items_summary}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold">{parseFloat(order.total_amount).toFixed(0)}</div>
                                    {order.payment_status !== 'paid' && (
                                        <div className="text-xs text-destructive">
                                            Due: {(order.total_amount - order.amount_paid).toFixed(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {orders.links && orders.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-1">
                    {orders.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded-md px-2.5 py-1 text-sm ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                        </Link>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
