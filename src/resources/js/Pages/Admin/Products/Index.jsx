import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '@/Layouts/AdminLayout';

function DeleteModal({ product, onConfirm, onCancel, deleting }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onCancel();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl">
                {/* Icon */}
                <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>

                    <h2 className="text-base font-semibold text-foreground">Delete product?</h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {product.flag_emoji && `${product.flag_emoji} `}{product.name}
                        </span>
                        {' '}will be permanently removed. This cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-border px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'photo_studio', label: 'Photo Studio' },
    { value: 'reprint', label: 'Reprint / Visa' },
    { value: 'album', label: 'Photo Album' },
    { value: 'frame', label: 'Photo Frame' },
    { value: 'mug', label: 'Mug Print' },
    { value: 'print', label: 'Photo Print' },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.slice(1).map((c) => [c.value, c.label]));

function DragHandle() {
    return (
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
    );
}

function ProductRow({ product, onToggleActive, onDelete, isDragOverlay = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={isDragOverlay ? {} : style}
            className={`border-b border-border/50 transition-colors hover:bg-muted/40 ${isDragOverlay ? 'bg-card shadow-lg' : ''}`}
        >
            <td className="w-8 px-3 py-3.5">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab touch-none rounded p-1 hover:bg-muted active:cursor-grabbing"
                    aria-label="Drag to reorder"
                >
                    <DragHandle />
                </button>
            </td>
            <td className="px-3 py-3.5 text-xs text-muted-foreground w-10 text-center">
                {product.sort_order}
            </td>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                    {product.flag_emoji && (
                        <span className="text-lg leading-none">{product.flag_emoji}</span>
                    )}
                    <span className="font-medium text-foreground">{product.name}</span>
                </div>
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
                    onClick={() => onToggleActive(product.id)}
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
                <div className="flex items-center justify-end gap-2">
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
                    <button
                        onClick={() => onDelete(product.id, product.name)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-background px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function ProductsIndex({ products: initialProducts, filters }) {
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [products, setProducts] = useState(initialProducts || []);
    const [activeProduct, setActiveProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

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

    const handleDelete = (productId, productName) => {
        const product = products.find((p) => p.id === productId);
        setDeleteTarget(product ?? { id: productId, name: productName });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/products/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
                setDeleteTarget(null);
            },
            onFinish: () => setDeleting(false),
        });
    };

    const handleToggleActive = (productId) => {
        router.patch(`/admin/products/${productId}/toggle-active`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setProducts((prev) =>
                    prev.map((p) => p.id === productId ? { ...p, is_active: !p.is_active } : p)
                );
            },
        });
    };

    const groupedProducts = useMemo(() => {
        const groups = {};
        for (const p of products) {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
        }
        return groups;
    }, [products]);

    const handleDragStart = ({ active }) => {
        setActiveProduct(products.find((p) => p.id === active.id) ?? null);
    };

    const handleDragEnd = ({ active, over }) => {
        setActiveProduct(null);
        if (!over || active.id === over.id) return;

        const activeItem = products.find((p) => p.id === active.id);
        const overItem = products.find((p) => p.id === over.id);

        if (!activeItem || !overItem || activeItem.category !== overItem.category) return;

        const categoryItems = products.filter((p) => p.category === activeItem.category);
        const oldIndex = categoryItems.findIndex((p) => p.id === active.id);
        const newIndex = categoryItems.findIndex((p) => p.id === over.id);

        const reordered = arrayMove(categoryItems, oldIndex, newIndex);

        const updatedItems = reordered.map((p, i) => ({
            ...p,
            sort_order: i === 0
                ? Math.max(0, overItem.sort_order - 1 < reordered[1]?.sort_order ? overItem.sort_order : reordered[0].sort_order)
                : p.sort_order,
        }));

        const globalSortBase = Math.min(...categoryItems.map((p) => p.sort_order));
        const reassigned = reordered.map((p, i) => ({ ...p, sort_order: globalSortBase + i }));

        setProducts((prev) => {
            const otherItems = prev.filter((p) => p.category !== activeItem.category);
            return [...otherItems, ...reassigned].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
        });

        setSaving(true);
        fetch('/admin/products/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
            },
            body: JSON.stringify({ items: reassigned.map((p) => ({ id: p.id, sort_order: p.sort_order })) }),
        })
            .finally(() => setSaving(false));
    };

    const categoryOrder = ['photo_studio', 'reprint', 'album', 'frame', 'mug', 'print'];
    const visibleCategories = categoryOrder.filter((c) => groupedProducts[c]);

    return (
        <AdminLayout>
            <Head title="Products - Admin Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Products</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your product catalogue · Drag rows to reorder
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {saving && (
                            <span className="text-xs text-muted-foreground">Saving order…</span>
                        )}
                        <Link
                            href="/admin/products/create"
                            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Add Product
                        </Link>
                    </div>
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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/60">
                                    <th className="w-8 px-3 py-3" />
                                    <th className="w-10 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Qty</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-14 text-center text-muted-foreground">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    visibleCategories.map((category) => (
                                        <>
                                            <tr key={`cat-${category}`} className="bg-muted/40">
                                                <td colSpan={8} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')}
                                                    <span className="ml-2 font-normal normal-case">({groupedProducts[category].length})</span>
                                                </td>
                                            </tr>
                                            <SortableContext
                                                key={`ctx-${category}`}
                                                items={groupedProducts[category].map((p) => p.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {groupedProducts[category].map((product) => (
                                                    <ProductRow
                                                        key={product.id}
                                                        product={product}
                                                        onToggleActive={handleToggleActive}
                                                        onDelete={handleDelete}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <DragOverlay>
                        {activeProduct ? (
                            <table className="min-w-full text-sm">
                                <tbody>
                                    <ProductRow product={activeProduct} onToggleActive={() => {}} onDelete={() => {}} isDragOverlay />
                                </tbody>
                            </table>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {deleteTarget && (
                    <DeleteModal
                        product={deleteTarget}
                        onConfirm={confirmDelete}
                        onCancel={() => !deleting && setDeleteTarget(null)}
                        deleting={deleting}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
