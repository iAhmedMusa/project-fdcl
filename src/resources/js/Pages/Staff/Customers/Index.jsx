import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

const FILTERS = [
    { value: 'all',           label: 'All Customers' },
    { value: 'walk_in',       label: 'Walk-in' },
    { value: 'login_enabled', label: 'Login Enabled' },
    { value: 'login_disabled', label: 'No Login' },
];

function LoginBadge({ hasLogin, isActive }) {
    if (!hasLogin) {
        return (
            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Not set
            </span>
        );
    }
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Enabled
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Disabled
        </span>
    );
}

function Avatar({ name }) {
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function CustomersIndex({ customers, filters }) {
    const [search, setSearch]     = useState(filters?.search || '');
    const [filter, setFilter]     = useState(filters?.filter || 'all');

    const applyFilters = (overrides = {}) => {
        const params = {
            search: (overrides.search  ?? search)  || undefined,
            filter: (overrides.filter  ?? filter) !== 'all' ? (overrides.filter ?? filter) : undefined,
        };
        router.get(route('staff.customers.index'), params, { preserveState: true });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const setFilterAndApply = (val) => {
        setFilter(val);
        applyFilters({ filter: val });
    };

    const clearFilters = () => {
        setSearch('');
        setFilter('all');
        router.get(route('staff.customers.index'));
    };

    const allCustomers = customers.data || [];
    const hasFilters   = search || filter !== 'all';

    return (
        <StaffLayout>
            <Head title="Customers" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customers</h1>
                    <p className="text-sm text-muted-foreground">Manage walk-in and registered customers</p>
                </div>
            </div>

            {/* Filter chips + search */}
            <div className="mb-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilterAndApply(f.value)}
                            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                                filter === f.value
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1 sm:max-w-sm">
                        <svg
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search by name or phone..."
                            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                    <button
                        onClick={() => applyFilters()}
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    >
                        Search
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

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border bg-card shadow-sm lg:block">
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Type
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Login Access
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Orders
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Since
                            </th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {allCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-16 text-center">
                                    <p className="text-sm font-medium text-foreground">No customers found</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {hasFilters ? 'Try adjusting your search or filter.' : 'Walk-in customers you create will appear here.'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            allCustomers.map((customer) => (
                                <tr key={customer.id} className="transition-colors hover:bg-accent/50">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={customer.name} />
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">{customer.name}</div>
                                                {customer.has_login && (
                                                    <div className="truncate text-xs text-muted-foreground">{customer.email}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                        {customer.phone || '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        {customer.is_walk_in ? (
                                            <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                Walk-in
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                Registered
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <LoginBadge hasLogin={customer.has_login} isActive={customer.is_active} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center text-sm font-medium">
                                        {customer.orders_count}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm text-muted-foreground">
                                        {customer.created_at}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                        <Link
                                            href={route('staff.customers.show', customer.id)}
                                            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            Manage →
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 lg:hidden">
                {allCustomers.length === 0 ? (
                    <div className="rounded-xl border bg-card p-8 text-center">
                        <p className="text-sm font-medium">No customers found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {hasFilters ? 'Try adjusting your search or filter.' : 'Walk-in customers you create will appear here.'}
                        </p>
                    </div>
                ) : (
                    allCustomers.map((customer) => (
                        <div key={customer.id} className="rounded-xl border bg-card p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar name={customer.name} />
                                    <div>
                                        <div className="font-medium">{customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{customer.phone || '—'}</div>
                                    </div>
                                </div>
                                <LoginBadge hasLogin={customer.has_login} isActive={customer.is_active} />
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t pt-3">
                                <div className="flex items-center gap-2">
                                    {customer.is_walk_in ? (
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Walk-in</span>
                                    ) : (
                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Registered</span>
                                    )}
                                    <span className="text-xs text-muted-foreground">{customer.orders_count} orders</span>
                                </div>
                                <Link
                                    href={route('staff.customers.show', customer.id)}
                                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    Manage →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {customers.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{customers.from}</span> to{' '}
                        <span className="font-medium text-foreground">{customers.to}</span> of{' '}
                        <span className="font-medium text-foreground">{customers.total}</span> customers
                    </p>
                    <div className="flex gap-1">
                        {customers.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2.5 text-sm transition ${
                                    link.active
                                        ? 'bg-primary font-medium text-primary-foreground'
                                        : 'border bg-card text-muted-foreground hover:bg-accent'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                            >
                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
