import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import BkashPaymentSection from '@/Components/Order/BkashPaymentSection';
import DeliverySection from '@/Components/Order/DeliverySection';
import CustomSelect from '@/Components/CustomSelect';

export default function PhotoReprint({ products, locations, deliveryFees, prefilledCode }) {
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
    const [selectedProduct, setSelectedProduct] = useState('');
    const [paperType, setPaperType] = useState('glossy');
    const [quantity, setQuantity] = useState(4);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [bkashRef, setBkashRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [errors, setErrors] = useState({});

    const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
    const sizeDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
                setSizeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    const minQty = selectedProductData?.min_quantity ?? 4;
    const qtyStep = selectedProductData?.quantity_step ?? 2;

    useEffect(() => {
        if (selectedProductData) {
            setQuantity(selectedProductData.min_quantity ?? 4);
        }
    }, [selectedProduct]);

    const productTotal = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;
    const deliveryFee = pickupType === 'delivery'
        ? (deliveryType === 'express' ? deliveryFees.express : deliveryFees.regular)
        : 0;
    const total = productTotal + deliveryFee;

    const hasPhoto = (activeTab === 'id' && foundRegistry) || (activeTab === 'upload' && uploadedFile);
    const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
    const canSubmit = hasPhoto && selectedProduct && quantity > 0
        && (pickupType === 'studio' ? locationId : deliveryAddressComplete && deliveryType)
        && bkashRef.trim();

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

    // ── Submit ───────────────────────────────────────────────────────────

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);

        if (activeTab === 'id') {
            router.post('/order/reprint', {
                registry_code: foundRegistry.code,
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
                paper_type: paperType,
                special_instructions: specialInstructions || null,
                bkash_reference: bkashRef,
            }, {
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            });
        } else {
            const formData = new FormData();
            formData.append('photo', uploadedFile);
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('paper_type', paperType);
            formData.append('bkash_reference', bkashRef);
            if (specialInstructions) formData.append('special_instructions', specialInstructions);
            appendDeliveryFields(formData);

            router.post('/order/reprint', formData, {
                forceFormData: true,
                onProgress: (e) => setUploadProgress(e.percentage),
                onError: (errs) => setErrors(errs),
                onFinish: () => { setSubmitting(false); setUploadProgress(null); },
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
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Select Your Photo</h2>

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
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                            <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            Photo ID
                            <span className="block text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">From our studio</span>
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
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                            <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                            <span className="block text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">From your device</span>
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
                                    placeholder="Enter your Photo ID"
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
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

                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                Enter the Photo ID provided by Focus Digital Color Lab when your photo was captured at our studio.
                            </p>

                            {lookupError && (
                                <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    {lookupError}
                                </div>
                            )}

                            {foundRegistry && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
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
                                                        backgroundImage: `url(${photo})`,
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
                                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-gray-600 dark:bg-gray-800">
                                    <svg className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-sm font-medium text-primary">Click to upload</span>
                                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">JPG, PNG — max 10MB</p>
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
                                <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                    {uploadPreview && (
                                        <img
                                            src={uploadPreview}
                                            alt="Preview"
                                            className="h-16 w-16 rounded border border-green-200 object-cover"
                                        />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-green-700 dark:text-green-400">{uploadedFile.name}</p>
                                        <p className="text-xs text-green-600 dark:text-green-500">
                                            {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="rounded-md p-1 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
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

                {/* ── Step 2: Print Details (only show when photo is ready) ── */}
                {hasPhoto && (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="rounded-lg border bg-card p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Print Details</h2>

                            {/* Photo size dropdown */}
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Photo size <span className="text-red-500">*</span>
                                </label>
                                <div className="relative" ref={sizeDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setSizeDropdownOpen((o) => !o)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
                                            sizeDropdownOpen
                                                ? 'border-primary ring-1 ring-primary'
                                                : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-800 text-left`}
                                    >
                                        {selectedProductData ? (
                                            <span className="flex items-center gap-2.5">
                                                {selectedProductData.flag_emoji && (
                                                    <span className="text-xl leading-none">{selectedProductData.flag_emoji}</span>
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedProductData.name}</span>
                                                <span className="text-gray-400 dark:text-gray-500">·</span>
                                                <span className="text-gray-500 dark:text-gray-400">{selectedProductData.size_label}</span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">Select size...</span>
                                        )}
                                        <svg
                                            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${sizeDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {sizeDropdownOpen && (
                                        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                            <div className="max-h-64 overflow-y-auto">
                                                {products.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedProduct(String(product.id));
                                                            setSizeDropdownOpen(false);
                                                        }}
                                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/60 ${
                                                            selectedProduct == product.id
                                                                ? 'bg-primary/5 dark:bg-primary/10'
                                                                : ''
                                                        }`}
                                                    >
                                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-lg leading-none">
                                                            {product.flag_emoji || '📷'}
                                                        </span>
                                                        <span className="flex-1 min-w-0">
                                                            <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</span>
                                                            <span className="block text-xs text-gray-400 dark:text-gray-500">{product.size_label}</span>
                                                        </span>
                                                        {selectedProduct == product.id && (
                                                            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.product_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>
                                )}
                            </div>

                            {/* Number of copies */}
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Number of copies <span className="text-red-500">*</span>
                                    <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">Minimum {minQty} per order</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(minQty, quantity - qtyStep))}
                                        disabled={quantity <= minQty}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        min={minQty}
                                        max="100"
                                        step={qtyStep}
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || minQty;
                                            const clamped = Math.min(100, Math.max(minQty, val));
                                            const remainder = (clamped - minQty) % qtyStep;
                                            setQuantity(remainder === 0 ? clamped : clamped + (qtyStep - remainder));
                                        }}
                                        className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(100, quantity + qtyStep))}
                                        disabled={quantity >= 100}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Paper type
                                </label>
                                <CustomSelect
                                    options={[
                                        { value: 'glossy', label: 'Glossy' },
                                        { value: 'matte', label: 'Matte' },
                                    ]}
                                    value={paperType}
                                    onChange={setPaperType}
                                />
                            </div>

                            {/* Special instructions */}
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Special instructions
                                    <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="e.g. Do not crop, specific colour notes, border preference..."
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
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
                            userAddress={usePage().props.auth?.user?.address}
                            errors={errors}
                        />

                        {/* Order Summary */}
                        {selectedProduct && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{selectedProductData?.name} ({selectedProductData?.size_label}) × {quantity}</span>
                                        <span className="font-medium">৳{productTotal.toFixed(0)}</span>
                                    </div>
                                    {pickupType === 'delivery' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Delivery ({deliveryType})</span>
                                            <span className="font-medium">৳{deliveryFee}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between border-t pt-2 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">Total</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">৳{total.toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* bKash Payment */}
                        <BkashPaymentSection
                            total={total}
                            value={bkashRef}
                            onChange={setBkashRef}
                            error={errors.bkash_reference}
                        />

                        {/* Upload progress */}
                        {uploadProgress !== null && (
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-primary">
                                    <span>Uploading photo...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full rounded-full bg-primary/20 h-2 overflow-hidden">
                                    <div
                                        className="h-2 rounded-full bg-primary transition-all duration-200"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!canSubmit || submitting}
                            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-50"
                        >
                            {submitting ? 'Placing order...' : 'Place Order'}
                        </button>
                    </form>
                )}
            </div>
        </CustomerLayout>
    );
}
