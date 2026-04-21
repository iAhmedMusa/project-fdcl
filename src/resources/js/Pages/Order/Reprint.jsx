import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import OrderLayout from '@/Layouts/OrderLayout';

export default function Reprint({ products, locations, prefilledCode }) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState('id'); // 'id' or 'upload'
    const [code, setCode] = useState(prefilledCode || '');
    const [foundRegistry, setFoundRegistry] = useState(null);
    const [lookupError, setLookupError] = useState('');
    const [lookingUp, setLookingUp] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [locationId, setLocationId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLookup = async (e) => {
        e.preventDefault();
        setLookingUp(true);
        setLookupError('');

        try {
            const response = await fetch('/reprint/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (response.ok && data.found) {
                setFoundRegistry(data.registry);
                setLocationId('');
            } else {
                setLookupError(data.message || 'Invalid FDCL Photo ID');
                setFoundRegistry(null);
            }
        } catch (error) {
            setLookupError('Unable to lookup code. Please try again.');
        } finally {
            setLookingUp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.user) {
            // Redirect to login
            window.location.href = route('login');
            return;
        }

        if (!foundRegistry || !selectedProduct) {
            return;
        }

        setSubmitting(true);

        router.post('/reprint/order', {
            registry_code: foundRegistry.code,
            product_id: selectedProduct,
            quantity: quantity,
            location_id: locationId,
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <OrderLayout>
            <Head title="Reorder Photos - FDCL" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-navy">Reorder Your Photos</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Use your FDCL Photo ID or upload new photos
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => {
                                setActiveTab('id');
                                setFoundRegistry(null);
                                setLookupError('');
                            }}
                            className={`flex-1 border-b-2 py-3 text-center text-sm font-semibold transition-colors ${
                                activeTab === 'id'
                                    ? 'border-gold text-gold'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            Use FDCL Photo ID
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`flex-1 border-b-2 py-3 text-center text-sm font-semibold transition-colors ${
                                activeTab === 'upload'
                                    ? 'border-gold text-gold'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            Upload New Photo
                        </button>
                    </div>
                </div>

                {/* Tab 1: FDCL ID */}
                {activeTab === 'id' && (
                    <div className="space-y-6">
                        <form onSubmit={handleLookup} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    FDCL Photo ID
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder="e.g., FDCL-4K8X2P"
                                        maxLength={20}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-mono text-lg uppercase focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={lookingUp || !code}
                                        className="rounded-lg bg-gold px-6 py-3 font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-50"
                                    >
                                        {lookingUp ? 'Searching...' : 'Find My Photos'}
                                    </button>
                                </div>
                                {lookupError && (
                                    <p className="mt-2 text-sm text-red-600">{lookupError}</p>
                                )}
                            </div>
                        </form>

                        {foundRegistry && (
                            <div className="rounded-lg border-2 border-gold bg-[#FFF8E7] p-6">
                                <div className="mb-4 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">Found</p>
                                    <p className="mt-1 font-mono text-2xl font-bold text-navy">
                                        {foundRegistry.code}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Created on {foundRegistry.created_at}
                                    </p>
                                </div>

                                {foundRegistry.photos.length > 0 && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Photos:</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {foundRegistry.photos.map((photo, i) => (
                                                <div
                                                    key={i}
                                                    className="aspect-square rounded border border-gray-300 bg-gray-100"
                                                    style={{
                                                        // backgroundImage: `url(/storage/${photo})`,
                                                        backgroundImage: `url(${photo})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Print Size
                                        </label>
                                        <select
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            <option value="">Select size...</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} ({product.size_label}) - ৳{product.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Pickup Location
                                        </label>
                                        <select
                                            value={locationId}
                                            onChange={(e) => setLocationId(e.target.value)}
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                        >
                                            <option value="">Select location...</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name} — {loc.address}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedProduct && (
                                        <div className="rounded-lg bg-navy/5 p-4">
                                            <div className="flex justify-between text-sm">
                                                <span>Total:</span>
                                                <span className="font-bold text-gold">
                                                    ৳{(products.find(p => p.id == selectedProduct)?.price * quantity || 0).toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {!auth.user && (
                                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                                            <p className="text-sm text-amber-800">
                                                <strong>Note:</strong> You'll need to login or register to complete this reorder.
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting || !selectedProduct}
                                        className="w-full rounded-lg bg-gold py-3 font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-50"
                                    >
                                        {submitting ? 'Processing...' : 'Place Reorder'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Upload New Photo */}
                {activeTab === 'upload' && (
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            To upload new photos and place an order, please use our{' '}
                            <Link href="/order" className="font-semibold text-gold hover:text-gold-dark">
                                Order Wizard
                            </Link>
                        </p>
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        href={route('customer.dashboard')}
                        className="text-sm text-gray-600 hover:text-navy dark:text-gray-400"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </OrderLayout>
    );
}