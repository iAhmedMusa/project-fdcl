import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const ROLE_COLORS = {
    admin: 'bg-primary text-primary-foreground',
    staff: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    customer: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function UsersIndex({ users, filters, locations }) {
    const [roleFilter, setRoleFilter] = useState(filters?.role || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'staff',
        location_id: '',
    });

    const applyFilters = () => {
        router.get('/admin/users', {
            role: roleFilter !== 'all' ? roleFilter : undefined,
            search: searchQuery || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setRoleFilter('all');
        setSearchQuery('');
        router.get('/admin/users');
    };

    const handleToggleActive = (userId) => {
        router.patch(`/admin/users/${userId}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        router.post('/admin/users', formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setFormData({ name: '', email: '', phone: '', address: '', role: 'staff', location_id: '' });
            },
        });
    };

    const hasFilters = roleFilter !== 'all' || searchQuery;

    return (
        <AdminLayout>
            <Head title="Users - Admin Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Users</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage user accounts and roles
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Staff
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-3 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="flex h-9 appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="customer">Customer</option>
                        </select>

                        <div className="relative flex-1 sm:max-w-xs">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search by name, email, phone..."
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

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Studio
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Orders
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Joined
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Active
                                </th>
                                <th className="relative px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                            </svg>
                                            <p className="mt-3 text-sm font-medium text-foreground">No users found</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {hasFilters ? 'Try adjusting your filters.' : 'Users will appear here once created.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-accent/50">
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                            {user.location ? user.location.name : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <span className="text-sm font-semibold text-foreground">
                                                {user.orders_count}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                            {user.created_at}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <button
                                                onClick={() => handleToggleActive(user.id)}
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                                                    user.is_active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && users.last_page > 1 && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{users.from}</span> to{' '}
                            <span className="font-medium text-foreground">{users.to}</span> of{' '}
                            <span className="font-medium text-foreground">{users.total}</span> users
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
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
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-lg">
                        <h3 className="text-base font-semibold text-foreground">Add Staff Account</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Create a new staff or admin account.</p>
                        
                        <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Email <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    rows={2}
                                    placeholder="Delivery address (optional)"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Role <span className="text-destructive">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Assigned Studio
                                </label>
                                <select
                                    value={formData.location_id}
                                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                                    className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">Select studio...</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-muted-foreground">The studio this staff member works at.</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="inline-flex h-9 flex-1 items-center justify-center rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-accent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}