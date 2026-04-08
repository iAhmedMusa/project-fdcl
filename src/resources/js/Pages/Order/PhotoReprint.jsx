import { useState, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function PhotoReprint({ products, locations, prefilledCode }) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState('id'); // 'id' or 'upload'

    // Photo ID lookup
    const [code, setCode] = useState(prefilledCode || '');
    const [foundRegistry, setFoundRegistry] = useState(null);
    const [lookupError, setLookupError] = useState('');
    const [lookingUp, setLookingUp] = useState(false);

    // Upload
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Common order fields
    const [selectedLocation, setSelectedLocation] = useState(locations?.[0]?.id?.toString() || '');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [paperType, setPaperType] = useState('glossy');
    const [quantity, setQuantity] = useState(4);
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const selectedProductData = products.find((p) => p.id == selectedProduct);
    const total = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;

    // Whether we have a photo ready (either from lookup or upload)
    const hasPhoto = (activeTab === 'id' && foundRegistry) || (activeTab === 'upload' && uploadedFile);
    const canSubmit = hasPhoto && selectedProduct && quantity > 0;

    // ── Lookup ───────────────────────────────────────────────────────────

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLookingUp(true);
        setLookupError('');

        try {
            const { data } = await window.axios.post('/reprint/lookup', { code: code.trim() });
            if (data.found) {
                setFoundRegistry(data.registry);
            } else {
                setLookupError(data.message || 'Photo ID not found. Please check and try again.');
                setFoundRegistry(null);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid FDCL Photo ID. Please check and try again.';
            setLookupError(message);
            setFoundRegistry(null);
        } finally {
            setLookingUp(false);
        }
    };

    // ── File upload ──────────────────────────────────────────────────────

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (ev) => setUploadPreview(ev.target.result);
        reader.readAsDataURL(file);
    }

    function removeFile() {
        setUploadedFile(null);
        setUploadPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    // ── Submit ───────────────────────────────────────────────────────────

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);

        if (activeTab === 'id') {
            // Registry-based reprint
            router.post('/order/reprint', {
                registry_code: foundRegistry.code,
                product_id: parseInt(selectedProduct),
                quantity: quantity,
                location_id: parseInt(selectedLocation),
                paper_type: paperType,
                special_instructions: specialInstructions || null,
            }, {
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            });
        } else {
            // Upload-based reprint
            const formData = new FormData();
            formData.append('photo', uploadedFile);
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('location_id', selectedLocation);
            formData.append('paper_type', paperType);
            if (specialInstructions) formData.append('special_instructions', specialInstructions);

            router.post('/order/reprint', formData, {
                forceFormData: true,
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            });
        }
    }

    return (
        <CustomerLayout>
            <Head title="Photo Reprint - FDCL" />

            <Link href="/order" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to services
            </Link>

            <div className="mb-5">
                <h1 className="text-lg font-semibold">Photo Reprint</h1>
                <p className="text-sm text-muted-foreground">Find your photo and order prints.</p>
            </div>

            <div className="max-w-xl">
                {/* ── Step 1: Select photo ────────────────────────────── */}
                <div className="rounded-lg border bg-card p-5">
                    <h2 className="text-base font-semibold text-gray-900">Select Your Photo</h2>

                    {/* Tabs */}
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('id');
                                setUploadedFile(null);
                                setUploadPreview(null);
                            }}
                            className={`flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-colors ${
                                activeTab === 'id'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            Photo ID
                            <span className="block text-xs font-normal text-gray-400 mt-0.5">From our studio</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('upload');
                                setFoundRegistry(null);
                                setLookupError('');
                            }}
                            className={`flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-colors ${
                                activeTab === 'upload'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                            <span className="block text-xs font-normal text-gray-400 mt-0.5">From your device</span>
                        </button>
                    </div>

                    {/* Photo ID tab content */}
                    {activeTab === 'id' && (
                        <div className="mt-4">
                            <form onSubmit={handleLookup} className="flex gap-2">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Photo ID (e.g. FDL-2024-001)"
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    disabled={lookingUp || !code.trim()}
                                    className="rounded-lg bg-primary px-4 py-2.5 text-white transition-colors hover:bg-accent disabled:opacity-50"
                                >
                                    {lookingUp ? (
                                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            <p className="mt-2 text-xs text-gray-400">
                                Enter the Photo ID provided by Focus Digital Color Lab when your photo was captured at our studio.
                            </p>

                            {lookupError && (
                                <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {lookupError}
                                </div>
                            )}

                            {foundRegistry && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        Photo found! — {foundRegistry.code}
                                    </div>
                                    {foundRegistry.photos?.length > 0 && (
                                        <div className="mt-3 flex gap-2">
                                            {foundRegistry.photos.slice(0, 3).map((photo, i) => (
                                                <div
                                                    key={i}
                                                    className="h-16 w-16 rounded border border-green-200 bg-white"
                                                    style={{
                                                        backgroundImage: `url(/storage/${photo})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload tab content */}
                    {activeTab === 'upload' && (
                        <div className="mt-4">
                            {!uploadedFile ? (
                                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5">
                                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-sm font-medium text-primary">Click to upload</span>
                                        <p className="mt-1 text-xs text-gray-400">JPG, PNG — max 10MB</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
                                    {uploadPreview && (
                                        <img
                                            src={uploadPreview}
                                            alt="Preview"
                                            className="h-16 w-16 rounded border border-green-200 object-cover"
                                        />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-green-700">{uploadedFile.name}</p>
                                        <p className="text-xs text-green-600">
                                            {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="rounded-md p-1 text-green-600 hover:bg-green-100"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {errors.photo && (
                                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Step 2: Size & Copies (only show when photo is ready) ──── */}
                {hasPhoto && (
                    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border bg-card p-5">
                        <h2 className="text-base font-semibold text-gray-900">Print Details</h2>

                        {/* Photo size dropdown */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Photo size <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select size...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} ({product.size_label}) — ৳{parseFloat(product.price).toFixed(0)}
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>
                            )}
                        </div>

                        {/* Number of copies */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Number of copies <span className="text-red-500">*</span>
                                <span className="ml-2 text-xs font-normal text-gray-400">Minimum 4 copies per order</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(4, quantity - 2))}
                                    disabled={quantity <= 4}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    min="4"
                                    max="100"
                                    step="2"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 4;
                                        const clamped = Math.min(100, Math.max(4, val));
                                        setQuantity(clamped % 2 === 0 ? clamped : clamped + 1);
                                    }}
                                    className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(100, quantity + 2))}
                                    disabled={quantity >= 100}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            {errors.quantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                            )}
                        </div>

                        {/* Paper type */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Paper type
                            </label>
                            <select
                                value={paperType}
                                onChange={(e) => setPaperType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="glossy">Glossy</option>
                                <option value="matte">Matte</option>
                            </select>
                        </div>

                        {/* Delivery method */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Delivery method <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="pickup"
                                        checked={deliveryMethod === 'pickup'}
                                        onChange={() => setDeliveryMethod('pickup')}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-700">Pickup from studio</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="home"
                                        disabled
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-500">Home delivery</span>
                                    <span className="text-xs text-gray-400">(Coming soon)</span>
                                </label>
                            </div>
                        </div>

                        {/* Pickup location dropdown */}
                        {deliveryMethod === 'pickup' && (
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Pickup studio <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name} — {location.address}
                                        </option>
                                    ))}
                                </select>
                                {errors.location_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location_id}</p>
                                )}
                            </div>
                        )}

                        {/* Special instructions */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Special instructions
                                <span className="ml-1 font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                rows={3}
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="e.g. Do not crop, specific colour notes, border preference..."
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Total */}
                        {selectedProduct && (
                            <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-gray-900">৳{total.toFixed(0)}</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                    {selectedProductData?.name} ({selectedProductData?.size_label}) × {quantity}
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!canSubmit || submitting}
                            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-50"
                        >
                            {submitting ? 'Placing order...' : 'Place Order'}
                        </button>
                    </form>
                )}
            </div>
        </CustomerLayout>
    );
}
