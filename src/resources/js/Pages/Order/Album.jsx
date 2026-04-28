import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import BkashPaymentSection from '@/Components/Order/BkashPaymentSection';
import DeliverySection from '@/Components/Order/DeliverySection';

export default function Album({ products, locations, deliveryFees }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [photoSource, setPhotoSource] = useState('');
    const [itemNotes, setItemNotes] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [bkashRef, setBkashRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Delivery state
    const [pickupType, setPickupType] = useState('studio');
    const [deliveryType, setDeliveryType] = useState('regular');
    const [locationId, setLocationId] = useState('');
    const [flat, setFlat] = useState('');
    const [road, setRoad] = useState('');
    const [block, setBlock] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    const selectedProductData = products.find((p) => p.id == selectedProduct);
    const productTotal = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;
    const deliveryFee = pickupType === 'delivery'
        ? (deliveryType === 'express' ? deliveryFees.express : deliveryFees.regular)
        : 0;
    const total = productTotal + deliveryFee;

    const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
    const canSubmit = selectedProduct && quantity > 0
        && (pickupType === 'studio' ? locationId : deliveryAddressComplete && deliveryType)
        && bkashRef.trim();

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);

        router.post('/order/album', {
            product_id: parseInt(selectedProduct),
            quantity,
            pickup_type: pickupType,
            location_id: pickupType === 'studio' ? parseInt(locationId) : null,
            delivery_type: pickupType === 'delivery' ? deliveryType : null,
            flat: pickupType === 'delivery' ? flat : null,
            road: pickupType === 'delivery' ? road : null,
            block: pickupType === 'delivery' ? block : null,
            postal_code: pickupType === 'delivery' ? postalCode : null,
            delivery_instructions: pickupType === 'delivery' ? deliveryInstructions : null,
            photo_source: photoSource || null,
            item_specific_notes: itemNotes || null,
            special_instructions: specialInstructions || null,
            bkash_reference: bkashRef,
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
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Select Album <span className="text-red-500">*</span></h2>
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
                                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>{product.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.size_label}</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">৳{parseFloat(product.price).toFixed(0)}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.product_id && <p className="mt-2 text-sm text-red-500">{errors.product_id}</p>}
                    </div>

                    {/* Photo Source */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Photo Source</h2>
                        <textarea
                            value={photoSource}
                            onChange={(e) => setPhotoSource(e.target.value)}
                            placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <p className="mt-2 text-xs text-gray-500">Provide link or describe how you will provide photos for your album.</p>
                    </div>

                    {/* Item Notes */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Note for Album <span className="font-normal text-gray-400">(Optional)</span></h2>
                        <textarea
                            value={itemNotes}
                            onChange={(e) => setItemNotes(e.target.value)}
                            placeholder="Any special instructions for album design..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Quantity <span className="text-red-500">*</span></h2>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                            </button>
                            <input type="number" min="1" max="100" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
                            <button type="button" onClick={() => setQuantity(Math.min(100, quantity + 1))} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Delivery Section */}
                    <DeliverySection
                        pickupType={pickupType} setPickupType={setPickupType}
                        deliveryType={deliveryType} setDeliveryType={setDeliveryType}
                        flat={flat} setFlat={setFlat}
                        road={road} setRoad={setRoad}
                        block={block} setBlock={setBlock}
                        postalCode={postalCode} setPostalCode={setPostalCode}
                        deliveryInstructions={deliveryInstructions} setDeliveryInstructions={setDeliveryInstructions}
                        locationId={locationId} setLocationId={setLocationId}
                        locations={locations}
                        regularFee={deliveryFees.regular}
                        expressFee={deliveryFees.express}
                        errors={errors}
                    />

                    {/* Special Instructions */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Special Instructions <span className="font-normal text-gray-400">(Optional)</span></h2>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="e.g. Matte paper, do not crop, specific colour notes..."
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Album:</span>
                                <span className="font-medium">{selectedProductData ? `${selectedProductData.name} × ${quantity}` : '-'}</span>
                            </div>
                            {pickupType === 'delivery' && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Delivery ({deliveryType}):</span>
                                    <span className="font-medium">৳{deliveryFee}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2 dark:border-gray-700">
                                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                                <span className="text-lg font-bold">৳{total.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                                <span className="font-medium text-pink-600 dark:text-pink-400">bKash</span>
                            </div>
                        </div>
                    </div>

                    {/* bKash Payment */}
                    <BkashPaymentSection total={total} value={bkashRef} onChange={setBkashRef} error={errors.bkash_reference} />

                    <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}
