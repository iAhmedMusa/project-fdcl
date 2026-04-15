import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Show({ registry }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        ready: 'bg-green-100 text-green-800',
        delivered: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStatusColors = {
        unpaid: 'bg-red-100 text-red-800',
        partial: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
    };

    return (
        <StaffLayout>
            <Head title={`Photo ID ${registry.registry_code} - Staff`} />

            {/* Back link */}
            <div className="mb-6">
                <Link
                    href="/staff/photos"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to Photo Storage
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{registry.registry_code}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Created {registry.created_at}
                        {registry.is_expired && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Expired
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {registry.is_expired ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                            Expired
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                            Active
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Photos Section */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Photos</h2>
                        {registry.photos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {registry.photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
                                    >
                                        <img
                                            // src={`/storage/${photo}`}
                                            src={photo}
                                            alt={`Photo ${index + 1}`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <a
                                            // href={`/storage/${photo}`}
                                            href={photo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No photos available</p>
                        )}
                    </div>

                    {/* Related Orders */}
                    <div className="mt-6 rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Related Orders ({registry.orders.length})</h2>
                        {registry.orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Order
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Customer
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {registry.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <Link
                                                        href={`/staff/orders/${order.order_number}`}
                                                        className="font-mono text-sm text-primary hover:underline"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {order.user ? (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                                                            <p className="text-sm text-gray-500">{order.user.phone}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-500">{order.location?.name || 'N/A'}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        ৳{order.total_amount.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-500">{order.created_at}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">No orders associated with this Photo ID</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Photo ID Info */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Details</h2>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Created</dt>
                                <dd className="mt-1 text-sm text-gray-900">{registry.created_at}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Expires</dt>
                                <dd className="mt-1 text-sm text-gray-900">{registry.expires_at || 'N/A'}</dd>
                            </div>
                            {registry.notes && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{registry.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Associated Customers */}
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Associated Customer{registry.all_customers && registry.all_customers.length > 1 ? 's' : ''}
                        </h2>
                        {registry.all_customers && registry.all_customers.length > 0 ? (
                            <div className="space-y-4">
                                {registry.all_customers.map((customer, index) => (
                                    <div key={customer.id} className={`rounded-lg border p-3 ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                        {index === 0 && (
                                            <p className="mb-1 text-xs font-medium text-blue-600">Original Owner</p>
                                        )}
                                        <div>
                                            <Link
                                                href={`/staff/customers/${customer.id}`}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                {customer.name}
                                            </Link>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                                        <div className="text-sm text-gray-500">{customer.email || 'No email'}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No customers associated with this Photo ID</p>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}