import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

const STATUS_CONFIG = {
    pending:    { label: 'Pending',    bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  border: 'border-orange-200' },
    processing: { label: 'Processing', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    border: 'border-blue-200' },
    ready:      { label: 'Ready',      bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    delivered:  { label: 'Delivered',  bg: 'bg-gray-50',    text: 'text-gray-600',    dot: 'bg-gray-400',    border: 'border-gray-200' },
    cancelled:  { label: 'Cancelled',  bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200' },
};

const PAYMENT_CONFIG = {
    unpaid:  { label: 'Unpaid',  bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
    partial: { label: 'Partial', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    paid:    { label: 'Paid',    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

function StatusBadge({ status }) {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function PaymentBadge({ status }) {
    const c = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.unpaid;
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text} ${c.border}`}>
            {c.label}
        </span>
    );
}

const INPUT = 'mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';
const LABEL = 'block text-sm font-medium text-foreground';
const ERR   = 'mt-1 text-xs text-destructive';

export default function CustomerShow({ customer, orders, photoRegistries = [] }) {
    const [resetConfirm, setResetConfirm] = useState(false);
    const [toggleConfirm, setToggleConfirm] = useState(false);

    // Profile form
    const profileForm = useForm({
        name:    customer.name    || '',
        phone:   customer.phone   || '',
        email:   customer.has_login ? customer.email : '',
        address: customer.address || '',
    });

    // Enable login form
    const loginForm = useForm({ email: '' });

    const saveProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('staff.customers.update', customer.id), {
            preserveScroll: true,
        });
    };

    const enableLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('staff.customers.enable-login', customer.id), {
            preserveScroll: true,
            onSuccess: () => loginForm.reset(),
        });
    };

    const resetPassword = () => {
        router.post(route('staff.customers.reset-password', customer.id), {}, {
            preserveScroll: true,
            onSuccess: () => setResetConfirm(false),
        });
    };

    const toggleActive = () => {
        router.patch(route('staff.customers.toggle-active', customer.id), {}, {
            preserveScroll: true,
            onSuccess: () => setToggleConfirm(false),
        });
    };

    const allOrders = orders.data || [];

    return (
        <StaffLayout>
            <Head title={`Customer — ${customer.name}`} />

            {/* Page header */}
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={route('staff.customers.index')}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{customer.name}</h1>
                            {customer.is_walk_in && (
                                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                    Walk-in
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">Customer since {customer.created_at}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left column */}
                <div className="space-y-6 lg:col-span-2">

                    {/* ── Profile Info ─────────────────────────────── */}
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">Customer Information</h2>
                        <form onSubmit={saveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL}>Name <span className="text-destructive">*</span></label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className={INPUT}
                                    />
                                    {profileForm.errors.name && <p className={ERR}>{profileForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className={LABEL}>Phone <span className="text-destructive">*</span></label>
                                    <input
                                        type="text"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className={INPUT}
                                    />
                                    {profileForm.errors.phone && <p className={ERR}>{profileForm.errors.phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={LABEL}>
                                        Email{' '}
                                        {!customer.has_login && (
                                            <span className="text-xs font-normal text-muted-foreground">(set via Login Access below)</span>
                                        )}
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        disabled={!customer.has_login}
                                        placeholder={customer.has_login ? 'email@example.com' : 'No email set — enable login first'}
                                        className={INPUT}
                                    />
                                    {profileForm.errors.email && <p className={ERR}>{profileForm.errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={LABEL}>
                                        Address{' '}
                                        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={profileForm.data.address}
                                        onChange={(e) => profileForm.setData('address', e.target.value)}
                                        placeholder="Customer address..."
                                        className={INPUT + ' resize-none'}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Login Access ─────────────────────────────── */}
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="mb-1 text-base font-semibold">Login Access</h2>
                        <p className="mb-5 text-sm text-muted-foreground">
                            Allow this customer to log in and manage their orders online.
                        </p>

                        {!customer.has_login ? (
                            /* Walk-in with no login — enable form */
                            <div className="rounded-lg border border-dashed p-5">
                                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                    No login access yet
                                </div>
                                <form onSubmit={enableLogin} className="space-y-3">
                                    <div>
                                        <label className={LABEL}>
                                            Customer Email <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={loginForm.data.email}
                                            onChange={(e) => loginForm.setData('email', e.target.value)}
                                            placeholder="customer@example.com"
                                            className={INPUT}
                                        />
                                        {loginForm.errors.email && <p className={ERR}>{loginForm.errors.email}</p>}
                                    </div>
                                    <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                                        <span className="font-medium">Default password:</span>{' '}
                                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Customer@1234</code>
                                        <span className="ml-2 text-muted-foreground">— customer should change this after first login.</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loginForm.processing}
                                        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                        {loginForm.processing ? 'Enabling...' : 'Enable Login'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Login already set up */
                            <div className="space-y-4">
                                {/* Status row */}
                                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                                    <div>
                                        <div className="text-sm font-medium">Login status</div>
                                        <div className="mt-0.5 text-xs text-muted-foreground">{customer.email}</div>
                                    </div>
                                    {customer.is_active ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                            Disabled
                                        </span>
                                    )}
                                </div>

                                {/* Toggle login */}
                                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                                    <div>
                                        <div className="text-sm font-medium">
                                            {customer.is_active ? 'Disable login' : 'Enable login'}
                                        </div>
                                        <div className="mt-0.5 text-xs text-muted-foreground">
                                            {customer.is_active
                                                ? 'Customer will no longer be able to sign in.'
                                                : 'Allow this customer to sign in again.'}
                                        </div>
                                    </div>
                                    {toggleConfirm ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Are you sure?</span>
                                            <button
                                                onClick={toggleActive}
                                                className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors ${
                                                    customer.is_active
                                                        ? 'bg-red-600 hover:bg-red-700'
                                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                                }`}
                                            >
                                                Yes, {customer.is_active ? 'disable' : 'enable'}
                                            </button>
                                            <button
                                                onClick={() => setToggleConfirm(false)}
                                                className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setToggleConfirm(true)}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                customer.is_active
                                                    ? 'border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                                    : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20'
                                            }`}
                                        >
                                            {customer.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                    )}
                                </div>

                                {/* Reset password */}
                                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                                    <div>
                                        <div className="text-sm font-medium">Reset password</div>
                                        <div className="mt-0.5 text-xs text-muted-foreground">
                                            Sets password back to{' '}
                                            <code className="rounded bg-muted px-1 font-mono text-xs">Customer@1234</code>
                                        </div>
                                    </div>
                                    {resetConfirm ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Are you sure?</span>
                                            <button
                                                onClick={resetPassword}
                                                className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-700"
                                            >
                                                Yes, reset
                                            </button>
                                            <button
                                                onClick={() => setResetConfirm(false)}
                                                className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setResetConfirm(true)}
                                            className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column — Photos + Order History */}
                <div className="space-y-6">

                    {/* ── Photo IDs ─────────────────────────────── */}
                    {photoRegistries.length > 0 && (
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="mb-4 text-base font-semibold">
                                Photo IDs
                                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                                    {photoRegistries.length}
                                </span>
                            </h2>
                            <div className="space-y-3">
                                {photoRegistries.map((registry) => (
                                    <Link
                                        key={registry.id}
                                        href={`/staff/photos/${registry.code}`}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-accent/50"
                                    >
                                        {registry.photos.length > 0 && (
                                            <div className="mb-2 flex gap-1.5">
                                                {registry.photos.slice(0, 3).map((photo, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-14 w-12 rounded border bg-muted overflow-hidden"
                                                        style={{
                                                            backgroundImage: `url(/storage/${photo})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    />
                                                ))}
                                                {registry.photos.length > 3 && (
                                                    <div className="flex h-14 w-12 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                                                        +{registry.photos.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-xs font-semibold text-primary">{registry.code}</p>
                                            {registry.is_shared && (
                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                                                    Shared
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{registry.created_at}</p>
                                        {registry.notes && (
                                            <p className="mt-0.5 truncate text-xs text-gray-500">{registry.notes}</p>
                                        )}
                                        {registry.is_expired && (
                                            <p className="mt-0.5 text-xs text-destructive">Expired</p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">
                            Order History
                            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                                {orders.total}
                            </span>
                        </h2>

                        {allOrders.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {allOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('staff.orders.show', order.order_number)}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-accent/50"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-mono text-xs font-semibold">
                                                {order.order_number}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="mt-1.5 flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">{order.created_at}</span>
                                            <div className="flex items-center gap-1.5">
                                                <PaymentBadge status={order.payment_status} />
                                                <span className="text-xs font-semibold">৳{order.total_amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {orders.last_page > 1 && (
                            <div className="mt-3 flex justify-center gap-1">
                                {orders.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                        className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded px-2 text-xs transition ${
                                            link.active
                                                ? 'bg-primary font-medium text-primary-foreground'
                                                : 'border text-muted-foreground hover:bg-accent'
                                        } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
