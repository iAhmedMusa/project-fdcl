import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import CustomSelect from '@/Components/CustomSelect';

const INPUT = 'mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
const LABEL = 'block text-sm font-medium text-foreground';
const ERR = 'mt-1 text-xs text-destructive';

export default function EditOrder({ order, products, locations }) {
    const [locationId, setLocationId] = useState(order.location_id);
    const [deliveryMethod, setDeliveryMethod] = useState(order.delivery_method);
    const [specialInstructions, setSpecialInstructions] = useState(order.special_instructions || '');
    const [notes, setNotes] = useState(order.notes || '');
    const [paperType, setPaperType] = useState(order.paper_type || 'glossy');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Reprint details
    const reprintItem = order.items?.find(item => item.category === 'reprint');
    const [reprintProductId, setReprintProductId] = useState(reprintItem?.product_id || '');
    const [reprintQuantity, setReprintQuantity] = useState(reprintItem?.quantity || 1);

    const reprintProducts = products.filter(p => p.category === 'reprint');
    const selectedProduct = reprintProducts.find(p => p.id == reprintProductId);
    const reprintTotal = selectedProduct ? parseFloat(selectedProduct.price) * reprintQuantity : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const data = {
            location_id: locationId,
            delivery_method: deliveryMethod,
            special_instructions: specialInstructions || null,
            notes: notes || null,
            reprint_product_id: reprintProductId || null,
            reprint_quantity: reprintQuantity,
            reprint_paper_type: paperType,
        };

        router.put(route('staff.orders.update', order.id), data, {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <StaffLayout>
            <Head title={`Edit Order ${order.order_number}`} />

            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={route('staff.orders.show', order.order_number)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Order</h1>
                    <p className="text-sm text-muted-foreground">{order.order_number} — Awaiting Photo</p>
                </div>
            </div>

            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3">
                <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        This order is awaiting a photo. You can edit the details below.
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <section className="rounded-xl border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Customer</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{order.customer?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{order.customer?.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{order.customer?.email || 'N/A'}</p>
                        </div>
                    </div>
                </section>

                {/* Reprint Details */}
                <section className="rounded-xl border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Reprint Details</h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={LABEL}>Photo Size</label>
                            <CustomSelect
                                options={reprintProducts.map((p) => ({
                                    value: p.id,
                                    label: p.name,
                                    subtitle: `${p.size_label} — ৳${parseFloat(p.price).toFixed(0)}`,
                                    icon: p.flag_emoji || null,
                                }))}
                                value={reprintProductId}
                                onChange={setReprintProductId}
                                placeholder="Select size..."
                                error={errors.reprint_product_id}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className={LABEL}>Number of Copies</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReprintQuantity(Math.max(1, reprintQuantity - 1))}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={reprintQuantity}
                                    onChange={(e) => setReprintQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                    className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setReprintQuantity(Math.min(100, reprintQuantity + 1))}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className={LABEL}>Paper Type</label>
                        <CustomSelect
                            options={[
                                { value: 'glossy', label: 'Glossy' },
                                { value: 'matte', label: 'Matte' },
                            ]}
                            value={paperType}
                            onChange={setPaperType}
                            className="mt-1"
                        />
                    </div>

                    {reprintProductId && (
                        <div className="mt-4 rounded-lg bg-muted/30 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Reprint Subtotal</span>
                                <span className="text-xl font-bold">৳{reprintTotal.toFixed(0)}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Delivery & Instructions */}
                <section className="rounded-xl border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Delivery & Instructions</h2>

                    <div className="mb-4">
                        <label className={LABEL}>Delivery Method</label>
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
                                <span className="text-sm">Pickup from studio</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="home"
                                    disabled
                                    className="h-4 w-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">Home delivery (Coming soon)</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className={LABEL}>Pickup Studio</label>
                        <CustomSelect
                            options={locations.map((loc) => ({
                                value: loc.id,
                                label: loc.name,
                                subtitle: loc.address,
                            }))}
                            value={locationId}
                            onChange={setLocationId}
                            placeholder="Select location..."
                            error={errors.location_id}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={LABEL}>Special Instructions (optional)</label>
                            <textarea
                                rows={2}
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="e.g. Matte paper, do not crop..."
                                className={INPUT + ' resize-none'}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={LABEL}>Staff Notes (internal)</label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Internal notes for staff..."
                                className={INPUT + ' resize-none'}
                            />
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link
                        href={route('staff.orders.show', order.order_number)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                Save Changes
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </StaffLayout>
    );
}