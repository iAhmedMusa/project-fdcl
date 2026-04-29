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
                <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/60">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Product
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Size
                                </th>
                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Price
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Min Qty
                                </th>
                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center text-muted-foreground">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                productsData.map((product, idx) => (
                                    <tr
                                        key={product.id}
                                        className={`border-b border-border/50 transition-colors hover:bg-muted/40 ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                {product.flag_emoji && (
                                                    <span className="text-lg leading-none">{product.flag_emoji}</span>
                                                )}
                                                <span className="font-medium text-foreground">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary ring-1 ring-inset ring-primary/20">
                                                {product.category.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                                            {product.size_label}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                                            <span className="font-semibold text-foreground">৳{product.price.toFixed(0)}</span>
                                            {product.copies_per_sheet > 1 && (
                                                <span className="ml-1 text-xs text-muted-foreground">/{product.copies_per_sheet}pc</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-center">
                                            <span className="font-medium text-foreground">{product.min_quantity}</span>
                                            <span className="ml-1 text-xs text-muted-foreground">+{product.quantity_step}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-center">
                                            <button
                                                onClick={() => handleToggleActive(product.id)}
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                                                    product.is_active
                                                        ? 'bg-green-100 text-green-700 ring-1 ring-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800'
                                                        : 'bg-red-100 text-red-700 ring-1 ring-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800'
                                                }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
                                                </svg>
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
