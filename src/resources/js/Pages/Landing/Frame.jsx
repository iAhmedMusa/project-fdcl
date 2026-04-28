import LandingLayout from '@/Layouts/LandingLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import BkashPaymentSection from '@/Components/Order/BkashPaymentSection';
import DeliverySection from '@/Components/Order/DeliverySection';

const STORAGE_KEY = 'pending_frame_order';

export default function Frame({ products, locations, deliveryFees }) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState('upload');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [photoSource, setPhotoSource] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [itemNotes, setItemNotes] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [bkashRef, setBkashRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
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
                if (data.activeTab) setActiveTab(data.activeTab);
                if (data.photoSource) setPhotoSource(data.photoSource);
                if (data.selectedProduct) setSelectedProduct(data.selectedProduct);
                if (data.quantity) setQuantity(data.quantity);
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

    const hasPhoto = (activeTab === 'upload' && uploadedFile) || (activeTab === 'source' && photoSource.trim());
    const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
    const canSubmit = hasPhoto && selectedProduct && quantity > 0
        && (pickupType === 'studio' ? locationId : deliveryAddressComplete && deliveryType)
        && (!auth.user || bkashRef.trim());

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setUploadPreview(ev.target.result);
        reader.readAsDataURL(file);
    }

    function removeFile() {
        setUploadedFile(null);
        setUploadPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function appendDeliveryFields(formData) {
        formData.append('pickup_type', pickupType);
        if (pickupType === 'studio') {
            formData.append('location_id', locationId);
        } else {
            formData.append('delivery_type', deliveryType);
            formData.append('flat', flat);
            formData.append('road', road);
            if (block) formData.append('block', block);
            formData.append('postal_code', postalCode);
            if (deliveryInstructions) formData.append('delivery_instructions', deliveryInstructions);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        if (!auth.user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                activeTab, photoSource, selectedProduct, quantity, itemNotes, specialInstructions, bkashRef,
                pickupType, deliveryType, locationId, flat, road, block, postalCode, deliveryInstructions,
            }));
            setShowLoginModal(true);
            return;
        }

        setSubmitting(true);

        if (activeTab === 'upload') {
            const formData = new FormData();
            formData.append('photo', uploadedFile);
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('bkash_reference', bkashRef);
            if (itemNotes) formData.append('item_specific_notes', itemNotes);
            if (specialInstructions) formData.append('special_instructions', specialInstructions);
            appendDeliveryFields(formData);

            router.post('/order/frame', formData, {
                forceFormData: true,
                onProgress: (e) => setUploadProgress(e.percentage),
                onError: (errs) => setErrors(errs),
                onFinish: () => {
                    localStorage.removeItem(STORAGE_KEY);
                    setSubmitting(false);
                    setUploadProgress(null);
                },
            });
        } else {
            router.post('/order/frame', {
                photo_source: photoSource,
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
    }

    return (
        <LandingLayout>
            <Head title="Photo Frame - FDCL" />

            <div className="mx-auto max-w-2xl px-4 pt-32 pb-16">
                <Link href="/#services" className="mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to services
                </Link>

                <div className="mb-5">
                    <h1 className="text-lg font-semibold text-text-primary dark:text-white">Photo Frame</h1>
                    <p className="text-sm text-text-secondary dark:text-gray-400">Order a custom photo frame.</p>
                </div>

                <div className="max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border bg-card p-5">
                            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Select Frame <span className="text-red-500">*</span></h2>
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
                            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Provide Your Photo <span className="text-red-500">*</span></h2>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('upload'); setPhotoSource(''); }}
                                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-colors ${
                                        activeTab === 'upload'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    Upload
                                    <span className="block text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">From your device</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('source'); removeFile(); }}
                                    className={`flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-colors ${
                                        activeTab === 'source'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m4.243 4.243L6.75 7.5l4.243 4.243m4.5-4.5L21.75 7.5l-4.243 4.243" />
                                    </svg>
                                    Link
                                    <span className="block text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">Google Drive, USB, etc.</span>
                                </button>
                            </div>

                            {activeTab === 'upload' && (
                                <div className="mt-4">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {!uploadedFile ? (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                                        >
                                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload photo</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG up to 10MB</p>
                                        </button>
                                    ) : (
                                        <div className="relative">
                                            <img src={uploadPreview} alt="Preview" className="w-full rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="absolute top-2 right-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'source' && (
                                <div className="mt-4">
                                    <textarea
                                        value={photoSource}
                                        onChange={(e) => setPhotoSource(e.target.value)}
                                        placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                    />
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Provide link or describe how you will provide the photo.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border bg-card p-5">
                            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Note for Frame <span className="font-normal text-gray-400">(Optional)</span></h2>
                            <textarea
                                value={itemNotes}
                                onChange={(e) => setItemNotes(e.target.value)}
                                placeholder="Any special instructions for frame..."
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>

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
                                    <span className="text-gray-500 dark:text-gray-400">Frame:</span>
                                    <span className="font-medium">{selectedProductData ? `${selectedProductData.name} × ${quantity}` : '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Photo:</span>
                                    <span className="font-medium">{activeTab === 'upload' ? (uploadedFile ? 'Uploaded' : 'Not provided') : (photoSource ? 'Link provided' : 'Not provided')}</span>
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

                        {uploadProgress !== null && (
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-primary">
                                    <span>Uploading photo...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full rounded-full bg-primary/20 h-2 overflow-hidden">
                                    <div className="h-2 rounded-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
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
                            <Link href={route('login') + '?intended=' + encodeURIComponent(window.location.pathname)} className="w-full rounded-lg bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                                Login
                            </Link>
                            <Link href={route('register') + '?intended=' + encodeURIComponent(window.location.pathname)} className="w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                Create Account
                            </Link>
                            <button onClick={() => setShowLoginModal(false)} className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LandingLayout>
    );
}
