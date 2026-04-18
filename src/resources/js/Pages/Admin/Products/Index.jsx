import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'photo_studio', label: 'Photo Studio' },
    { value: 'reprint', label: 'Reprint / Visa' },
    { value: 'album', label: 'Photo Album' },
    { value: 'frame', label: 'Photo Frame' },
    { value: 'mug', label: 'Mug Print' },
    { value: 'print', label: 'Photo Print' },
];

export default function ProductsIndex({ products, filters }) {
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const applyFilters = () => {
        router.get('/admin/products', {
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            search: searchQuery || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setCategoryFilter('all');
        setSearchQuery('');
        router.get('/admin/products');
    };

    const handleToggleActive = (productId) => {
        router.patch(`/admin/products/${productId}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    // Ensure products data exists
    const productsData = products?.data || [];
    const productsLinks = products?.links || [];
    const hasFilters = categoryFilter !== 'all' || searchQuery;

    return (
        <AdminLayout>
            <Head title="Products - Admin Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Products</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your product catalogue
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-4 rounded-lg bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="h-9 min-w-[10rem] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="h-9 min-w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="rounded-md border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto rounded-lg bg-card shadow-sm">
                    <table className="min-w-full divide-y text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Size
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Active
                                </th>
                                <th className="relative px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-card">
                            {productsData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                productsData.map((product) => (
                                    <tr key={product.id} className="transition-colors hover:bg-muted">
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="text-sm font-semibold text-foreground">
                                                {product.name}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                                {product.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                            {product.size_label}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="text-sm font-bold text-foreground">
                                                ৳{product.price.toFixed(0)}
                                            </div>
                                            {product.copies_per_sheet > 1 && (
                                                <div className="text-xs text-muted-foreground">
                                                    / {product.copies_per_sheet}copies
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleActive(product.id)}
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                                                    product.is_active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products?.last_page > 1 && productsLinks.length > 0 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {productsLinks.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`rounded-md px-3 py-2 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card text-foreground hover:bg-accent'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
