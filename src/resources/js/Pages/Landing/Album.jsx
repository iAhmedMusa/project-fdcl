import LandingLayout from '@/Layouts/LandingLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BkashPaymentSection from '@/Components/Order/BkashPaymentSection';
import DeliverySection from '@/Components/Order/DeliverySection';

const STORAGE_KEY = 'pending_album_order';

export default function Album({ products, locations, deliveryFees }) {
    const { auth } = usePage().props;

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [photoSource, setPhotoSource] = useState('');
    const [itemNotes, setItemNotes] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [bkashRef, setBkashRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Delivery state
    const [pickupType, setPickupType] = useState('studio');
    const [deliveryType, setDeliveryType] = useState('regular');
    const [locationId, setLocationId] = useState('');
    const [flat, setFlat] = useState('');
    const [road, setRoad] = useState('');
    const [block, setBlock] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.selectedProduct) setSelectedProduct(data.selectedProduct);
                if (data.quantity) setQuantity(data.quantity);
                if (data.photoSource) setPhotoSource(data.photoSource);
                if (data.itemNotes) setItemNotes(data.itemNotes);
                if (data.specialInstructions) setSpecialInstructions(data.specialInstructions);
                if (data.bkashRef) setBkashRef(data.bkashRef);
                if (data.pickupType) setPickupType(data.pickupType);
                if (data.deliveryType) setDeliveryType(data.deliveryType);
                if (data.locationId) setLocationId(data.locationId);
                if (data.flat) setFlat(data.flat);
                if (data.road) setRoad(data.road);
                if (data.block) setBlock(data.block);
                if (data.postalCode) setPostalCode(data.postalCode);
                if (data.deliveryInstructions) setDeliveryInstructions(data.deliveryInstructions);
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {}
    }, []);

    const selectedProductData = products.find((p) => p.id == selectedProduct);
    const productTotal = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;
    const deliveryFee = pickupType === 'delivery'
        ? (deliveryType === 'express' ? deliveryFees.express : deliveryFees.regular)
        : 0;
    const total = productTotal + deliveryFee;

    const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
    const canSubmit = selectedProduct && quantity > 0
        && (pickupType === 'studio' ? locationId : deliveryAddressComplete && deliveryType)
        && (!auth.user || bkashRef.trim());

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        if (!auth.user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selectedProduct, quantity, photoSource, itemNotes, specialInstructions, bkashRef,
                pickupType, deliveryType, locationId, flat, road, block, postalCode, deliveryInstructions,
            }));
            setShowLoginModal(true);
            return;
        }

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
            onFinish: () => {
                localStorage.removeItem(STORAGE_KEY);
                setSubmitting(false);
            },
        });
    }

    return (
        <LandingLayout>
            <Head title="Photo Album - FDCL" />

            <div className="mx-auto max-w-2xl px-4 pt-32 pb-16">
                <Link href="/#services" className="mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to services
                </Link>

                <div className="mb-5">
                    <h1 className="text-lg font-semibold text-text-primary dark:text-white">Photo Album</h1>
                    <p className="text-sm text-text-secondary dark:text-gray-400">Order a custom photo album.</p>
                </div>

                <div className="max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.size_label}</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">৳{parseFloat(product.price).toFixed(0)}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.product_id && <p className="mt-2 text-sm text-red-500">{errors.product_id}</p>}
                        </div>

                        <div className="rounded-lg border bg-card p-5">
                            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Photo Source</h2>
                            <textarea
                                value={photoSource}
                                onChange={(e) => setPhotoSource(e.target.value)}
                                placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Provide link or describe how you will provide photos for your album.
                            </p>
                        </div>

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

                        <div className="rounded-lg border bg-card p-5">
                            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Quantity <span className="text-red-500">*</span></h2>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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
                                    className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>

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
                            userAddress={usePage().props.auth?.user?.address}
                            errors={errors}
                        />

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
                                    <span className="font-bold text-lg">৳{total.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                                    <span className="font-medium text-pink-600 dark:text-pink-400">bKash</span>
                                </div>
                            </div>
                        </div>

                        {auth.user && (
                            <BkashPaymentSection
                                total={total}
                                value={bkashRef}
                                onChange={setBkashRef}
                                error={errors.bkash_reference}
                            />
                        )}

                        <button
                            type="submit"
                            disabled={!canSubmit || submitting}
                            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>

            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Login Required</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                You need an account to place an order. Please login or create an account to continue.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            <Link
                                href={route('login') + '?intended=' + encodeURIComponent(window.location.pathname)}
                                className="w-full rounded-lg bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register') + '?intended=' + encodeURIComponent(window.location.pathname)}
                                className="w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Create Account
                            </Link>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LandingLayout>
    );
}
