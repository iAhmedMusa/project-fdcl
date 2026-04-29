import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const CATEGORIES = [
    { value: 'photo_studio', label: 'Photo Studio' },
    { value: 'reprint', label: 'Reprint / Visa'},
    { value: 'album', label: 'Photo Album' },
    { value: 'frame', label: 'Photo Frame' },
    { value: 'mug', label: 'Mug Print' },
    { value: 'print', label: 'Photo Print' },
];

export default function ProductForm({ product }) {
    const isEditing = product !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        category: product?.category || 'photo_studio',
        size_label: product?.size_label || '',
        width_mm: product?.width_mm || '',
        height_mm: product?.height_mm || '',
        price: product?.price || '',
        copies_per_sheet: product?.copies_per_sheet || 1,
        min_quantity: product?.min_quantity ?? 4,
        quantity_step: product?.quantity_step ?? 2,
        description: product?.description || '',
        is_active: product?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            width_mm: data.width_mm || null,
            height_mm: data.height_mm || null,
        };

        if (isEditing) {
            put(`/admin/products/${product.id}`, formData);
        } else {
            post('/admin/products', formData);
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Product' : 'Add Product'} />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Link
                    href="/admin/products"
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
                
                <div className="mb-4">
                    <h1 className="text-lg font-semibold text-foreground">
                        {isEditing ? 'Edit Product' : 'Add Product'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditing ? 'Update product information' : 'Create a new product'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-2xl rounded-lg border bg-card p-5 shadow-sm">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Product Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="e.g., Bangladesh Passport"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Category <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-destructive">{errors.category}</p>
                            )}
                        </div>

                        {/* Size Label */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Size Label <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.size_label}
                                onChange={(e) => setData('size_label', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="e.g., 35×45mm or 4R"
                            />
                            {errors.size_label && (
                                <p className="mt-1 text-sm text-destructive">{errors.size_label}</p>
                            )}
                        </div>

                        {/* Dimensions */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Width (mm)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.width_mm}
                                    onChange={(e) => setData('width_mm', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="35"
                                />
                                {errors.width_mm && (
                                    <p className="mt-1 text-sm text-destructive">{errors.width_mm}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Height (mm)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.height_mm}
                                    onChange={(e) => setData('height_mm', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="45"
                                />
                                {errors.height_mm && (
                                    <p className="mt-1 text-sm text-destructive">{errors.height_mm}</p>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Price (৳) <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="40"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-destructive">{errors.price}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Copies per Sheet <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.copies_per_sheet}
                                    onChange={(e) => setData('copies_per_sheet', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="8"
                                />
                                {errors.copies_per_sheet && (
                                    <p className="mt-1 text-sm text-destructive">{errors.copies_per_sheet}</p>
                                )}
                            </div>
                        </div>

                        {/* Quantity settings */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Minimum Quantity <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.min_quantity}
                                    onChange={(e) => setData('min_quantity', parseInt(e.target.value) || 1)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="4"
                                />
                                {errors.min_quantity && (
                                    <p className="mt-1 text-sm text-destructive">{errors.min_quantity}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-foreground">
                                    Increased By <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantity_step}
                                    onChange={(e) => setData('quantity_step', parseInt(e.target.value) || 1)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="2"
                                />
                                {errors.quantity_step && (
                                    <p className="mt-1 text-sm text-destructive">{errors.quantity_step}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Optional description..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-input text-primary focus:ring-1 focus:ring-ring"
                            />
                            <label htmlFor="is_active" className="text-sm text-foreground">
                                Product is active and available for ordering
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/admin/products"
                                className="inline-flex h-9 flex-1 items-center justify-center rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-accent"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}