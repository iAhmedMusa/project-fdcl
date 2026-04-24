import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const ROLE_STYLES = {
    admin:    { badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
    staff:    { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' },
    customer: { badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', dot: 'bg-teal-500' },
};

const AVATAR_COLORS = [
    'from-primary/80 to-primary',
    'from-purple-500 to-purple-600',
    'from-teal-500 to-teal-600',
    'from-blue-500 to-blue-600',
    'from-rose-500 to-rose-600',
];

function getAvatarGradient(name) {
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function RoleBadge({ role }) {
    const s = ROLE_STYLES[role] ?? { badge: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
}

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
        router.patch(`/admin/users/${userId}/toggle-active`, {}, { preserveScroll: true });
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

    const inputClass = "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
    const selectClass = "flex h-9 w-full cursor-pointer appearance-none rounded-lg border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

    return (
        <AdminLayout>
            <Head title="Users - Admin Panel" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Users</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">Manage accounts and roles.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Staff
                    </button>
                </div>

                {/* Filters */}
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-9 cursor-pointer appearance-none rounded-lg border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="customer">Customer</option>
                            </select>
                            <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>

                        <div className="relative flex-1 sm:max-w-xs">
                            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search name, email, phone…"
                                className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                            >
                                Search
                            </button>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex h-9 cursor-pointer items-center rounded-lg border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Studio</th>
                                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</th>
                                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="relative px-4 py-3.5"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-muted p-4">
                                                <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-foreground">No users found</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {hasFilters ? 'Try adjusting your filters.' : 'Users will appear here once created.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="group transition-colors hover:bg-muted/30">
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(user.name)} text-xs font-bold text-white`}>
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                                            {user.location ? user.location.name : '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <span className="text-sm font-bold text-foreground">{user.orders_count}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">{user.created_at}</td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                            <button
                                                onClick={() => handleToggleActive(user.id)}
                                                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                                                    user.is_active
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="cursor-pointer text-sm font-semibold text-primary hover:underline"
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
                    <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{users.from}</span>–<span className="font-semibold text-foreground">{users.to}</span> of{' '}
                            <span className="font-semibold text-foreground">{users.total}</span> users
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`inline-flex h-8 min-w-[2rem] cursor-pointer items-center justify-center rounded-lg px-2.5 text-sm transition-colors ${
                                        link.active
                                            ? 'bg-primary font-semibold text-primary-foreground'
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border bg-card shadow-2xl">
                        <div className="flex items-center justify-between border-b px-6 py-5">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Add Staff Account</h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">Create a new staff or admin account.</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Full name"
                                    className={inputClass}
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
                                    placeholder="email@example.com"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="relative">
                                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                                        Role <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className={selectClass}
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <svg className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="flex w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    rows={2}
                                    placeholder="Delivery address (optional)"
                                />
                            </div>

                            <div className="relative">
                                <label className="mb-1.5 block text-sm font-medium text-foreground">Assigned Studio</label>
                                <select
                                    value={formData.location_id}
                                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                                    className={selectClass}
                                >
                                    <option value="">Select studio…</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>{location.name}</option>
                                    ))}
                                </select>
                                <svg className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border bg-card text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
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
