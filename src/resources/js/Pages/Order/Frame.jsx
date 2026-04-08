import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Frame({ products, locations }) {
    const [activeTab, setActiveTab] = useState('upload');
    
    // Upload
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileInputRef = useRef(null);
    
    // Photo source
    const [photoSource, setPhotoSource] = useState('');
    
    // Common fields
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState(locations?.[0]?.id?.toString() || '');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const selectedProductData = products.find((p) => p.id == selectedProduct);
    const total = selectedProductData ? parseFloat(selectedProductData.price) * quantity : 0;
    
    const hasPhoto = (activeTab === 'upload' && uploadedFile) || (activeTab === 'source' && photoSource.trim());
    const canSubmit = hasPhoto && selectedProduct && quantity > 0 && selectedLocation;

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

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);

        if (activeTab === 'upload') {
            const formData = new FormData();
            formData.append('photo', uploadedFile);
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('location_id', selectedLocation);
            if (specialInstructions) formData.append('special_instructions', specialInstructions);

            router.post('/order/frame', formData, {
                forceFormData: true,
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/order/frame', {
                photo_source: photoSource,
                product_id: parseInt(selectedProduct),
                quantity: quantity,
                location_id: parseInt(selectedLocation),
                special_instructions: specialInstructions || null,
            }, {
                onError: (errs) => setErrors(errs),
                onFinish: () => setSubmitting(false),
            });
        }
    }

    return (
        <CustomerLayout>
            <Head title="Photo Frame - FDCL" />

            <Link href="/order" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to services
            </Link>

            <div className="mb-5">
                <h1 className="text-lg font-semibold">Photo Frame</h1>
                <p className="text-sm text-muted-foreground">Order a custom photo frame.</p>
            </div>

            <div className="max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Source */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Provide Your Photo</h2>

                        {/* Tabs */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('upload');
                                    setPhotoSource('');
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
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('source');
                                    removeFile();
                                }}
                                className={`flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-colors ${
                                    activeTab === 'source'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                            >
                                <svg className="mx-auto mb-1.5 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m4.243 4.243L6.75 7.5l4.243 4.243m4.5-4.5L21.75 7.5l-4.243 4.243" />
                                </svg>
                                Link
                                <span className="block text-xs font-normal text-gray-400 mt-0.5">Google Drive, USB, etc.</span>
                            </button>
                        </div>

                        {/* Upload Tab */}
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
                                        className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400"
                                    >
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium text-gray-600">Click to upload photo</p>
                                        <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
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

                        {/* Source Tab */}
                        {activeTab === 'source' && (
                            <div className="mt-4">
                                <textarea
                                    value={photoSource}
                                    onChange={(e) => setPhotoSource(e.target.value)}
                                    placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Provide link or describe how you will provide the photo.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Product Selection */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Select Frame</h2>
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

                    {/* Quantity */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Quantity</h2>
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
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Pickup Location</h2>
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
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Special Instructions (Optional)</h2>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="Any special requests or notes..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-lg border bg-card p-5">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Frame:</span>
                                <span className="font-medium">
                                    {selectedProductData ? `${selectedProductData.name} × ${quantity}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Photo:</span>
                                <span className="font-medium">
                                    {activeTab === 'upload' ? (uploadedFile ? 'Uploaded' : 'Not provided') : (photoSource ? 'Link provided' : 'Not provided')}
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