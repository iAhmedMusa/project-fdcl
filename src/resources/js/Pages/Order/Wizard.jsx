import { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import OrderLayout from '@/Layouts/OrderLayout';
import StepIndicator from '@/Components/Order/StepIndicator';
import PhotoUpload from '@/Components/Order/PhotoUpload';
import OrderSummary from '@/Components/Order/OrderSummary';
import BkashPaymentSection from '@/Components/Order/BkashPaymentSection';
import CustomSelect from '@/Components/CustomSelect';

// ─── Service definitions (icons match landing page) ──────────────────────────

const SERVICE_DEFS = [
    {
        category: 'photo_studio',
        title: 'Photo Studio',
        description: 'Passport, visa, ID photos — ready in 10 minutes',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        ),
    },
    {
        category: 'reprint',
        title: 'Photo Reprint',
        description: 'Reorder with FDCL ID or bring your own photo',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
        ),
    },
    {
        category: 'album',
        title: 'Photo Album',
        description: 'Beautiful printed albums for every occasion',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
    {
        category: 'frame',
        title: 'Photo Frame',
        description: 'Custom framed wall prints in any size',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
        ),
    },
    {
        category: 'mug',
        title: 'Mug Print',
        description: 'Photo mugs — single or bulk orders',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        ),
    },
    {
        category: 'print',
        title: 'Photo Print',
        description: 'Any size, any format, any quantity',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-3 0h.008v.008h-.008V12Z" />
            </svg>
        ),
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function allowsMultiplePhotos(category) {
    return category === 'album' || category === 'frame';
}

// ─── Wizard ─────────────────────────────────────────────────────────────────

export default function Wizard({ products, locations, deliveryFees }) {
    const { auth } = usePage().props;

    const [step, setStep] = useState(1);
    const [service, setService] = useState(null);
    const [items, setItems] = useState({}); // { productId: { quantity, files: [] } }

    // Delivery state
    const [pickupType, setPickupType] = useState('studio');
    const [locationId, setLocationId] = useState('');
    const [deliveryType, setDeliveryType] = useState('regular');
    const [flat, setFlat] = useState('');
    const [road, setRoad] = useState('');
    const [block, setBlock] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    const [specialInstructions, setSpecialInstructions] = useState('');
    const [bkashRef, setBkashRef] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Flat array of all products
    const allProducts = useMemo(() => {
        return Object.values(products).flat();
    }, [products]);

    // Products for current service
    const filteredProducts = useMemo(() => {
        if (!service) return [];
        return products[service] || [];
    }, [products, service]);

    // Items with qty > 0
    const activeItems = useMemo(() => {
        return Object.entries(items)
            .filter(([, v]) => v.quantity > 0)
            .map(([productId, v]) => ({
                product_id: parseInt(productId),
                quantity: v.quantity,
                files: v.files || [],
            }));
    }, [items]);

    const locationName = locations.find((l) => l.id === parseInt(locationId))?.name;

    const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
    const deliveryFee = pickupType === 'delivery'
        ? (deliveryType === 'express' ? deliveryFees.express : deliveryFees.regular)
        : 0;

    // ─── Step navigation ─────────────────────────────────────────────────

    function canAdvance() {
        if (step === 1) return !!service;
        if (step === 2) {
            if (activeItems.length === 0) return false;
            if (pickupType === 'studio') return !!locationId;
            return !!(deliveryAddressComplete && deliveryType);
        }
        if (step === 3) return true;
        if (step === 4) return true;
        return false;
    }

    function next() {
        if (canAdvance() && step < 5) setStep(step + 1);
    }

    function back() {
        if (step > 1) setStep(step - 1);
    }

    // ─── Qty helpers ─────────────────────────────────────────────────────

    function setQty(productId, qty) {
        setItems((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                quantity: Math.max(0, qty),
                files: prev[productId]?.files || [],
            },
        }));
    }

    function setFiles(productId, files) {
        setItems((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], files },
        }));
    }

    // ─── Submit ──────────────────────────────────────────────────────────

    function handleSubmit() {
        if (!auth.user) return;
        setSubmitting(true);

        const payload = {
            pickup_type: pickupType,
            location_id: pickupType === 'studio' ? parseInt(locationId) : null,
            delivery_type: pickupType === 'delivery' ? deliveryType : null,
            flat: pickupType === 'delivery' ? flat : null,
            road: pickupType === 'delivery' ? road : null,
            block: pickupType === 'delivery' ? block : null,
            postal_code: pickupType === 'delivery' ? postalCode : null,
            delivery_instructions: pickupType === 'delivery' ? deliveryInstructions : null,
            special_instructions: specialInstructions || null,
            bkash_reference: bkashRef,
            items: activeItems.map((item) => {
                const product = allProducts.find((p) => p.id === item.product_id);
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: parseFloat(product.price),
                    photo_paths: null,
                };
            }),
        };

        router.post('/order', payload, {
            onFinish: () => setSubmitting(false),
        });
    }

    // ─── Render ──────────────────────────────────────────────────────────

    return (
        <OrderLayout>
            <Head title="Order" />

            {/* Step Indicator */}
            <div className="mb-8">
                <StepIndicator current={step} />
            </div>

            {/* Step Content */}
            <div className="pb-24 sm:pb-8">
                {step === 1 && (
                    <Step1
                        service={service}
                        onSelect={(cat) => {
                            setService(cat);
                            setItems({});
                            setStep(2);
                        }}
                    />
                )}
                {step === 2 && (
                    <Step2
                        products={filteredProducts}
                        items={items}
                        setQty={setQty}
                        locations={locations}
                        locationId={locationId}
                        setLocationId={setLocationId}
                        pickupType={pickupType}
                        setPickupType={setPickupType}
                        deliveryType={deliveryType}
                        setDeliveryType={setDeliveryType}
                        flat={flat} setFlat={setFlat}
                        road={road} setRoad={setRoad}
                        block={block} setBlock={setBlock}
                        postalCode={postalCode} setPostalCode={setPostalCode}
                        deliveryInstructions={deliveryInstructions} setDeliveryInstructions={setDeliveryInstructions}
                        deliveryFees={deliveryFees}
                    />
                )}
                {step === 3 && (
                    <Step3
                        activeItems={activeItems}
                        allProducts={allProducts}
                        service={service}
                        items={items}
                        setFiles={setFiles}
                    />
                )}
                {step === 4 && (
                    <Step4
                        activeItems={activeItems}
                        allProducts={allProducts}
                        locationName={locationName}
                        pickupType={pickupType}
                        deliveryType={deliveryType}
                        deliveryFee={deliveryFee}
                        specialInstructions={specialInstructions}
                        setSpecialInstructions={setSpecialInstructions}
                    />
                )}
                {step === 5 && (
                    <Step5
                        activeItems={activeItems}
                        allProducts={allProducts}
                        deliveryFee={deliveryFee}
                        bkashRef={bkashRef}
                        setBkashRef={setBkashRef}
                        auth={auth}
                        submitting={submitting}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-navy p-3 sm:hidden">
                <div className="flex items-center gap-3">
                    <span className="shrink-0 text-xs text-white/40">
                        Step {step} of 4
                    </span>
                    {step > 1 && (
                        <button
                            onClick={back}
                            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white"
                        >
                            Back
                        </button>
                    )}
                    {step < 5 && step > 1 && (
                        <button
                            onClick={next}
                            disabled={!canAdvance()}
                            className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy transition-colors disabled:opacity-40"
                        >
                            Next
                        </button>
                    )}
                    {step === 5 && auth.user && (
                        <button
                            onClick={handleSubmit}
                            disabled={!bkashRef.trim() || submitting}
                            className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy transition-colors disabled:opacity-40"
                        >
                            {submitting ? 'Placing…' : 'Place Order'}
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop navigation buttons */}
            {step > 1 && (
                <div className="mt-6 hidden items-center justify-between sm:flex">
                    <button
                        onClick={back}
                        className="flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>
                    {step < 5 && (
                        <button
                            onClick={next}
                            disabled={!canAdvance()}
                            className="rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-40"
                        >
                            Next Step
                        </button>
                    )}
                </div>
            )}
        </OrderLayout>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Step Components
// ═══════════════════════════════════════════════════════════════════════════

function Step1({ service, onSelect }) {
    return (
        <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
                Choose a service
            </h2>
            <p className="mt-1 text-sm text-white/50">
                What would you like to order?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {SERVICE_DEFS.map((svc) => (
                    <button
                        key={svc.category}
                        onClick={() => onSelect(svc.category)}
                        className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/5 sm:p-5 ${
                            service === svc.category
                                ? 'border-gold bg-gold/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-gold/30'
                        }`}
                    >
                        <div className="text-gold">{svc.icon}</div>
                        <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">
                            {svc.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/40">
                            {svc.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

const inputDark = 'w-full rounded-lg border border-white/20 bg-navy-light px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

function Step2({
    products, items, setQty, locations,
    locationId, setLocationId,
    pickupType, setPickupType,
    deliveryType, setDeliveryType,
    flat, setFlat, road, setRoad, block, setBlock,
    postalCode, setPostalCode,
    deliveryInstructions, setDeliveryInstructions,
    deliveryFees,
}) {
    return (
        <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
                Choose size & quantity
            </h2>
            <p className="mt-1 text-sm text-white/50">
                Select the products you need and adjust quantities.
            </p>

            <div className="mt-6 space-y-3">
                {products.map((product) => {
                    const qty = items[product.id]?.quantity || 0;
                    return (
                        <div
                            key={product.id}
                            className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                                qty > 0
                                    ? 'border-gold/30 bg-gold/5'
                                    : 'border-white/10 bg-white/[0.03]'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-white sm:text-base">
                                        {product.name}
                                    </h3>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/40">
                                        {product.size_label && (
                                            <span>{product.size_label}</span>
                                        )}
                                        {product.copies_per_sheet > 1 && (
                                            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] text-gold">
                                                {product.copies_per_sheet} copies/sheet
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gold sm:text-base">
                                        ৳{parseFloat(product.price).toFixed(0)}
                                    </span>

                                    {/* Qty Stepper */}
                                    <div className="flex items-center rounded-lg border border-white/20">
                                        <button
                                            onClick={() => setQty(product.id, qty - 1)}
                                            className="px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-white"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[2rem] text-center text-sm font-medium text-white">
                                            {qty}
                                        </span>
                                        <button
                                            onClick={() => setQty(product.id, qty + 1)}
                                            className="px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pickup / Delivery Toggle */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-white/60">
                    Delivery Method
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setPickupType('studio')}
                        className={`rounded-lg border p-4 text-left transition-all ${
                            pickupType === 'studio'
                                ? 'border-gold bg-gold/10'
                                : 'border-white/20 bg-white/[0.03] hover:border-white/40'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                pickupType === 'studio' ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'
                            }`}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Studio Pickup</p>
                                <p className="text-xs text-white/40">Pick up at our location</p>
                            </div>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPickupType('delivery')}
                        className={`rounded-lg border p-4 text-left transition-all ${
                            pickupType === 'delivery'
                                ? 'border-gold bg-gold/10'
                                : 'border-white/20 bg-white/[0.03] hover:border-white/40'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                pickupType === 'delivery' ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'
                            }`}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3m-9 0h-3" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Home Delivery</p>
                                <p className="text-xs text-white/40">Pathao Courier</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Studio — location dropdown */}
            {pickupType === 'studio' && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-white/60">
                        Pickup Location <span className="text-red-400">*</span>
                    </label>
                    <CustomSelect
                        options={locations.map((loc) => ({
                            value: loc.id,
                            label: loc.name,
                            subtitle: loc.address,
                        }))}
                        value={locationId}
                        onChange={setLocationId}
                        placeholder="Select studio..."
                        variant="dark"
                        className="mt-1.5"
                    />
                </div>
            )}

            {/* Delivery — type + address */}
            {pickupType === 'delivery' && (
                <div className="mt-4 space-y-4">
                    {/* Delivery type */}
                    <div>
                        <label className="block text-sm font-medium text-white/60">
                            Delivery Speed <span className="text-red-400">*</span>
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setDeliveryType('regular')}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    deliveryType === 'regular'
                                        ? 'border-gold bg-gold/10'
                                        : 'border-white/20 bg-white/[0.03] hover:border-white/40'
                                }`}
                            >
                                <p className={`text-sm font-semibold ${deliveryType === 'regular' ? 'text-gold' : 'text-white'}`}>Regular</p>
                                <p className="text-xs text-white/40">2–3 days</p>
                                <p className={`mt-1 text-sm font-bold ${deliveryType === 'regular' ? 'text-gold' : 'text-white'}`}>+৳{deliveryFees.regular}</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeliveryType('express')}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    deliveryType === 'express'
                                        ? 'border-gold bg-gold/10'
                                        : 'border-white/20 bg-white/[0.03] hover:border-white/40'
                                }`}
                            >
                                <p className={`text-sm font-semibold ${deliveryType === 'express' ? 'text-gold' : 'text-white'}`}>Express</p>
                                <p className="text-xs text-white/40">Next day</p>
                                <p className={`mt-1 text-sm font-bold ${deliveryType === 'express' ? 'text-gold' : 'text-white'}`}>+৳{deliveryFees.express}</p>
                            </button>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-white/60">
                            Delivery Address <span className="text-red-400">*</span>
                        </label>
                        <div className="mt-2 space-y-2">
                            <input type="text" value={flat} onChange={(e) => setFlat(e.target.value)} placeholder="Flat / Apt / House No." className={inputDark} />
                            <input type="text" value={road} onChange={(e) => setRoad(e.target.value)} placeholder="Road / Street" className={inputDark} />
                            <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} placeholder="Block / Avenue / Area (optional)" className={inputDark} />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" className={inputDark} />
                                <input type="text" value="Dhaka" disabled className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/30" />
                            </div>
                        </div>
                    </div>

                    {/* Delivery instructions */}
                    <div>
                        <label className="block text-sm font-medium text-white/60">
                            Note for Delivery Man <span className="text-white/30 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            placeholder="e.g. Call before arriving, leave with guard..."
                            rows={2}
                            className={inputDark + ' mt-1.5 resize-none'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function Step3({ activeItems, allProducts, service, items, setFiles }) {
    const multi = allowsMultiplePhotos(service);

    return (
        <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
                Upload photos
            </h2>
            <p className="mt-1 text-sm text-white/50">
                {multi
                    ? 'Upload your photos for each item. You can add multiple files.'
                    : 'Upload a photo for each item. One photo per product.'}
            </p>

            <div className="mt-6 space-y-6">
                {activeItems.map((item) => {
                    const product = allProducts.find((p) => p.id === item.product_id);
                    if (!product) return null;
                    const files = items[item.product_id]?.files || [];

                    return (
                        <div
                            key={item.product_id}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white sm:text-base">
                                    {product.name}
                                    <span className="ml-2 text-xs text-white/40">
                                        × {item.quantity}
                                    </span>
                                </h3>
                                {files.length > 0 && (
                                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                                        {files.length} file{files.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <PhotoUpload
                                files={files}
                                onChange={(f) => setFiles(item.product_id, f)}
                                multiple={multi}
                            />
                        </div>
                    );
                })}

                {activeItems.length === 0 && (
                    <p className="text-center text-sm text-white/30">
                        No items selected. Go back to add products.
                    </p>
                )}
            </div>
        </div>
    );
}

function Step4({
    activeItems,
    allProducts,
    locationName,
    pickupType,
    deliveryType,
    deliveryFee,
    specialInstructions,
    setSpecialInstructions,
}) {
    return (
        <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
                Review your order
            </h2>
            <p className="mt-1 text-sm text-white/50">
                Check everything is correct before proceeding to payment.
            </p>

            <div className="mt-6">
                <OrderSummary
                    items={activeItems}
                    products={allProducts}
                    locationName={locationName}
                    pickupType={pickupType}
                    deliveryType={deliveryType}
                    deliveryFee={deliveryFee}
                />
            </div>

            {/* Special Instructions */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-white/60">
                    Special instructions (optional)
                </label>
                <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="E.g. specific background colour, retouching requests…"
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-white/20 bg-navy-light px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
            </div>
        </div>
    );
}

function Step5({ activeItems, allProducts, deliveryFee, bkashRef, setBkashRef, auth, submitting, onSubmit }) {
    const productTotal = activeItems.reduce((sum, item) => {
        const product = allProducts.find((p) => p.id === item.product_id);
        return sum + (product ? parseFloat(product.price) * item.quantity : 0);
    }, 0);
    const total = productTotal + deliveryFee;

    return (
        <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
                Payment
            </h2>
            <p className="mt-1 text-sm text-white/50">
                Pay via bKash and enter your reference to place the order.
            </p>

            <div className="mt-6">
                <BkashPaymentSection
                    total={total}
                    value={bkashRef}
                    onChange={setBkashRef}
                    dark={true}
                />
            </div>

            {/* Submit / Login prompt */}
            <div className="mt-6 hidden sm:block">
                {auth.user ? (
                    <button
                        onClick={onSubmit}
                        disabled={!bkashRef.trim() || submitting}
                        className="w-full rounded-lg bg-gold py-3.5 text-base font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-40 sm:w-auto sm:px-10"
                    >
                        {submitting ? 'Placing order…' : 'Place Order'}
                    </button>
                ) : (
                    <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 text-center">
                        <p className="text-sm text-white/60">
                            You need to be logged in to place an order.
                        </p>
                        <Link
                            href={`/login?redirect=/order`}
                            className="mt-3 inline-block rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy"
                        >
                            Login to complete your order
                        </Link>
                    </div>
                )}
            </div>

            {!auth.user && (
                <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4 text-center sm:hidden">
                    <p className="text-sm text-white/60">
                        You need to be logged in to place an order.
                    </p>
                    <Link
                        href={`/login?redirect=/order`}
                        className="mt-3 inline-block rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy"
                    >
                        Login to complete your order
                    </Link>
                </div>
            )}
        </div>
    );
}
