import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Album({ products, locations }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [photoSource, setPhotoSource] = useState('');
    const [itemNotes, setItemNotes] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const selectedProductData = products.find((p) => p.id == selectedProduct);
    const total = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;
    const canSubmit = selectedProduct && quantity > 0 && selectedLocation;

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);

        router.post('/order/album', {
            product_id: parseInt(selectedProduct),
            quantity: quantity,
            location_id: parseInt(selectedLocation),
            photo_source: photoSource || null,
            item_specific_notes: itemNotes || null,
            special_instructions: specialInstructions || null,
        }, {
            onError: (errs) => setErrors(errs),
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <CustomerLayout>
            <Head title="Photo Album - FDCL" />

            <Link href="/order" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to services
            </Link>

            <div className="mb-5">
                <h1 className="text-lg font-semibold">Photo Album</h1>
                <p className="text-sm text-muted-foreground">Order a custom photo album.</p>
            </div>

            <div className="max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Selection */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Select Album <span className="text-red-500">*</span></h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {products.map((product) => {
                                const isSelected = selectedProduct === product.id.toString();
                                return (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => setSelectedProduct(product.id.toString())}
                                        className={`rounded-lg border p-3 text-left transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{product.size_label}</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">৳{parseFloat(product.price).toFixed(0)}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.product_id && <p className="mt-2 text-sm text-red-500">{errors.product_id}</p>}
                    </div>

                    {/* Photo Source */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Photo Source</h2>
                        <textarea
                            value={photoSource}
                            onChange={(e) => setPhotoSource(e.target.value)}
                            placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Provide link or describe how you will provide photos for your album.
                        </p>
                    </div>

                    {/* Item Notes */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Note for Album <span className="font-normal text-gray-400">(Optional)</span></h2>
                        <textarea
                            value={itemNotes}
                            onChange={(e) => setItemNotes(e.target.value)}
                            placeholder="Any special instructions for album design..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Quantity <span className="text-red-500">*</span></h2>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Pickup Location */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Pickup Location <span className="text-red-500">*</span></h2>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select location...</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name} — {loc.address}
                                </option>
                            ))}
                        </select>
                        {errors.location_id && <p className="mt-2 text-sm text-red-500">{errors.location_id}</p>}
                    </div>

                    {/* Special Instructions */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Special Instructions <span className="font-normal text-gray-400">(Optional)</span></h2>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="e.g. Matte paper, do not crop, specific colour notes..."
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Album:</span>
                                <span className="font-medium">
                                    {selectedProductData ? `${selectedProductData.name} × ${quantity}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total:</span>
                                <span className="font-bold text-lg">৳{total.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment:</span>
                                <span className="font-medium text-amber-600">Pay at pickup</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}
