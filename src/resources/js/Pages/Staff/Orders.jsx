import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

const SERVICE_TYPE_LABELS = {
    photo_studio: 'Photo Print & ID',
    reprint:      'Upload Photo',
    album:        'Album',
    frame:        'Frame',
    mug:          'Mug',
};

const SERVICE_TYPE_COLORS = {
    photo_studio: 'bg-amber-50 text-amber-700 border-amber-200',
    reprint:      'bg-blue-50 text-blue-700 border-blue-200',
    album:        'bg-emerald-50 text-emerald-700 border-emerald-200',
    frame:        'bg-orange-50 text-orange-700 border-orange-200',
    mug:          'bg-purple-50 text-purple-700 border-purple-200',
};

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-200' },
    processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200' },
    ready: { label: 'Ready', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    delivered: { label: 'Delivered', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', border: 'border-gray-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200' },
};

const PAYMENT_CONFIG = {
    unpaid: { label: 'Unpaid', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    partial: { label: 'Partial', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

function PaymentBadge({ status }) {
    const config = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.unpaid;
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
}

function AwaitingPhotoBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Awaiting Photo
        </span>
    );
}

function StatCard({ label, value, icon, accent }) {
    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className={`mt-1 text-2xl font-semibold tracking-tight ${accent || 'text-foreground'}`}>{value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function Orders({ orders, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [dateFilter, setDateFilter] = useState(filters?.date || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const applyFilters = () => {
        router.get('/staff', {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            date: dateFilter !== 'all' ? dateFilter : undefined,
            search: searchQuery || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setDateFilter('all');
        setSearchQuery('');
        router.get('/staff');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const hasFilters = statusFilter !== 'all' || dateFilter !== 'all' || searchQuery;

    // Compute summary stats from current page data
    const allOrders = orders.data || [];
    const stats = {
        total: orders.total ?? allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        ready: allOrders.filter(o => o.status === 'ready').length,
    };

    return (
        <StaffLayout>
            <Head title="Order Queue - Staff Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-3">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground">Order Queue</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and track customer orders
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard
                        label="Total Orders"
                        value={stats.total}
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Pending"
                        value={stats.pending}
                        accent="text-orange-600"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Processing"
                        value={stats.processing}
                        accent="text-blue-600"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Ready"
                        value={stats.ready}
                        accent="text-emerald-600"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>

                {/* Filters */}
                <div className="mb-3 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-9 appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="relative">
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="flex h-9 appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        <div className="relative flex-1 sm:max-w-xs">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search order # or customer..."
                                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="inline-flex h-9 items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                            >
                                Apply
                            </button>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex h-9 items-center rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-accent"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-hidden rounded-lg border bg-card shadow-sm lg:block">
                    <table className="min-w-full divide-y divide-border">
                        <thead>
                            <tr className="bg-muted/80">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Order
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Photo ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Service Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Location
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Payment
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Created
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-16 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                                                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-foreground">No orders found</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {hasFilters ? 'Try adjusting your filters.' : 'Orders will appear here once created.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                allOrders.map((order) => (
                                    <tr key={order.id} className="group transition-colors hover:bg-accent/50">
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <Link
                                                href={`/staff/orders/${order.order_number}`}
                                                className="font-mono text-sm font-semibold text-navy hover:text-gold transition-colors"
                                            >
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            {order.photo_id ? (
                                                <span className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">
                                                    {order.photo_id}
                                                </span>
                                            ) : order.is_awaiting_photo ? (
                                                <AwaitingPhotoBadge />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-wrap gap-1">
                                                {order.service_types && order.service_types.length > 0 ? (
                                                    order.service_types.map((type) => (
                                                        <span
                                                            key={type}
                                                            className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${SERVICE_TYPE_COLORS[type] ?? 'bg-muted text-muted-foreground border-border'}`}
                                                        >
                                                            {SERVICE_TYPE_LABELS[type] ?? type}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                {order.location.name}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                            <span className="text-sm font-semibold text-foreground">
                                                ৳{order.total_amount.toLocaleString()}
                                            </span>
                                            {order.amount_paid > 0 && order.payment_status !== 'paid' && (
                                                <div className="text-xs text-muted-foreground">
                                                    ৳{order.amount_paid.toLocaleString()} paid
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <PaymentBadge status={order.payment_status} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                            <div className="text-sm text-muted-foreground">{order.created_at}</div>
                                            <div className="text-xs text-muted-foreground hidden group-hover:block">{order.created_at_formatted}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 lg:hidden">
                    {allOrders.length === 0 ? (
                        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <p className="mt-3 text-sm font-medium text-foreground">No orders found</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {hasFilters ? 'Try adjusting your filters.' : 'Orders will appear here once created.'}
                            </p>
                        </div>
                    ) : (
                        allOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/staff/orders/${order.order_number}`}
                                className="block rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-sm"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <span className="font-mono text-sm font-semibold text-navy">
                                            {order.order_number}
                                        </span>
                                        <div className="mt-0.5 text-xs text-muted-foreground">{order.created_at}</div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

{order.photo_id && (
                                        <div className="mb-3">
                                            <span className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">
                                                {order.photo_id}
                                            </span>
                                        </div>
                                    )}
                                    {order.is_awaiting_photo && !order.photo_id && (
                                        <div className="mb-3">
                                            <AwaitingPhotoBadge />
                                        </div>
                                    )}

                                    {order.service_types && order.service_types.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-1">
                                            {order.service_types.map((type) => (
                                                <span
                                                    key={type}
                                                    className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${SERVICE_TYPE_COLORS[type] ?? 'bg-muted text-muted-foreground border-border'}`}
                                                >
                                                    {SERVICE_TYPE_LABELS[type] ?? type}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            {order.location.name}
                                        </div>
                                        <PaymentBadge status={order.payment_status} />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        ৳{order.total_amount.toLocaleString()}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {orders.links && orders.last_page > 1 && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{orders.from}</span> to{' '}
                            <span className="font-medium text-foreground">{orders.to}</span> of{' '}
                            <span className="font-medium text-foreground">{orders.total}</span> orders
                        </p>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2.5 text-sm transition ${
                                        link.active
                                            ? 'bg-primary font-medium text-primary-foreground'
                                            : 'border bg-card text-muted-foreground hover:bg-accent'
                                    } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
