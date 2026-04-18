import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ready: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ROLE_COLORS = {
    admin: 'bg-primary text-primary-foreground',
    staff: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    customer: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function UsersShow({ user, orders, photo_registries }) {
    return (
        <AdminLayout>
            <Head title={`${user.name} - User Details`} />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/admin/users"
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Users
                </Link>

                {/* User Info */}
                <div className="mb-5 rounded-lg border bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-semibold text-foreground">{user.name}</h1>
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </div>
                                <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                                    <p>{user.email}</p>
                                    {user.phone && <p>{user.phone}</p>}
                                    {user.address && user.address !== 'Not provided' && (
                                        <p>{user.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.is_active 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Photo Registries */}
                {photo_registries.length > 0 && (
                    <div className="mb-4 rounded-lg border bg-card p-5 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">FDCL Photo IDs</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {photo_registries.map((registry) => (
                                <div key={registry.registry_code} className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Photo ID</p>
                                    <p className="mt-1 font-mono text-base font-semibold text-foreground">
                                        {registry.registry_code}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Created: {registry.created_at}
                                    </p>
                                    {registry.order_number && (
                                        <p className="text-xs text-muted-foreground">
                                            Order: {registry.order_number}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b p-4">
                        <h2 className="text-sm font-semibold text-foreground">Order History</h2>
                    </div>
                    
                    {orders.data.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-muted-foreground">No orders found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Order #
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Items
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Date
                                            </th>
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
                                                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                                    {order.location.name}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-center text-sm text-muted-foreground">
                                                    {order.items_count}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-foreground">
                                                    ৳{order.total_amount.toFixed(0)}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                                    {order.created_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {orders.links && orders.last_page > 1 && (
                                <div className="flex items-center justify-between border-t px-4 py-3">
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
                                            >
                                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}