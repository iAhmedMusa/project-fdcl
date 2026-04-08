import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ registries, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [customerFilter, setCustomerFilter] = useState(filters.customer || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/staff/photos', { search, status: statusFilter, customer: customerFilter }, { preserveState: true });
    };

    const handleFilterChange = (newStatus, newCustomer) => {
        router.get('/staff/photos', { search, status: newStatus, customer: newCustomer }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setCustomerFilter('all');
        router.get('/staff/photos', {}, { preserveState: true });
    };

    return (
        <StaffLayout>
            <Head title="Photo Storage - Staff" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Photo Storage</h1>
                <p className="mt-1 text-sm text-gray-500">Manage all stored photo IDs and their associations</p>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-lg border bg-white p-4">
                <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Photo ID
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toUpperCase())}
                            placeholder="e.g. FDCL-001001"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="min-w-[150px]">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                handleFilterChange(e.target.value, customerFilter);
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                    <div className="min-w-[150px]">
                        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                            Customer
                        </label>
                        <select
                            id="customer"
                            value={customerFilter}
                            onChange={(e) => {
                                setCustomerFilter(e.target.value);
                                handleFilterChange(statusFilter, e.target.value);
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="all">All</option>
                            <option value="has_customer">Has Customer</option>
                            <option value="no_customer">No Customer</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                        >
                            Search
                        </button>
                        {(filters.search || filters.status !== 'all' || filters.customer !== 'all') && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Photo ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Orders
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Expires
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {registries.data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No photo IDs found
                                </td>
                            </tr>
                        ) : (
                            registries.data.map((registry) => (
                                <tr key={registry.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/staff/photos/${registry.registry_code}`}
                                            className="font-mono text-sm font-medium text-primary hover:underline"
                                        >
                                            {registry.registry_code}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {registry.user ? (
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{registry.user.name}</p>
                                                <p className="text-sm text-gray-500">{registry.user.phone}</p>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{registry.orders_count}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{registry.created_at}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{registry.expires_at || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {registry.is_expired ? (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                Expired
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {registries.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {registries.from} to {registries.to} of {registries.total} results
                    </p>
                    <div className="flex gap-2">
                        {registries.prev_page_url && (
                            <a
                                href={registries.prev_page_url}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </a>
                        )}
                        {registries.next_page_url && (
                            <a
                                href={registries.next_page_url}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </a>
                        )}
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}