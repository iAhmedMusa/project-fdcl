export default function DeliverySection({
    pickupType, setPickupType,
    deliveryType, setDeliveryType,
    flat, setFlat,
    road, setRoad,
    block, setBlock,
    postalCode, setPostalCode,
    deliveryInstructions, setDeliveryInstructions,
    locationId, setLocationId,
    locations,
    regularFee,
    expressFee,
    errors = {},
}) {
    const inputCls = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100';

    return (
        <div className="rounded-lg border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                Pickup / Delivery <span className="text-red-500">*</span>
            </h2>

            {/* Toggle */}
            <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setPickupType('studio')}
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-all ${
                        pickupType === 'studio'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                    }`}
                >
                    <svg className={`h-4 w-4 shrink-0 ${pickupType === 'studio' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className={`text-sm font-medium ${pickupType === 'studio' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                        Studio Pickup
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setPickupType('delivery')}
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-all ${
                        pickupType === 'delivery'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                    }`}
                >
                    <svg className={`h-4 w-4 shrink-0 ${pickupType === 'delivery' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3" />
                    </svg>
                    <div className="text-left">
                        <p className={`text-sm font-medium leading-none ${pickupType === 'delivery' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            Home Delivery
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">Steadfast Courier</p>
                    </div>
                </button>
            </div>

            {/* Studio — location dropdown */}
            {pickupType === 'studio' && (
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pickup Studio <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        className={inputCls}
                    >
                        <option value="">Select studio...</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} — {loc.address}
                            </option>
                        ))}
                    </select>
                    {errors.location_id && <p className="mt-1 text-sm text-red-500">{errors.location_id}</p>}
                </div>
            )}

            {/* Delivery — type + address fields */}
            {pickupType === 'delivery' && (
                <div className="space-y-4">
                    {/* Delivery type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Delivery Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setDeliveryType('regular')}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    deliveryType === 'regular'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                                }`}
                            >
                                <p className={`text-sm font-semibold ${deliveryType === 'regular' ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                    Regular
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2–3 days</p>
                                <p className={`mt-1 text-sm font-bold ${deliveryType === 'regular' ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                    +৳{regularFee}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeliveryType('express')}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    deliveryType === 'express'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                                }`}
                            >
                                <p className={`text-sm font-semibold ${deliveryType === 'express' ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                    Express
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Next day</p>
                                <p className={`mt-1 text-sm font-bold ${deliveryType === 'express' ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                    +৳{expressFee}
                                </p>
                            </button>
                        </div>
                        {errors.delivery_type && <p className="mt-1 text-sm text-red-500">{errors.delivery_type}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={flat}
                                onChange={(e) => setFlat(e.target.value)}
                                placeholder="Flat / Apt / House No."
                                className={inputCls}
                            />
                            <input
                                type="text"
                                value={road}
                                onChange={(e) => setRoad(e.target.value)}
                                placeholder="Road / Street"
                                className={inputCls}
                            />
                            <input
                                type="text"
                                value={block}
                                onChange={(e) => setBlock(e.target.value)}
                                placeholder="Block / Avenue / Area (optional)"
                                className={inputCls}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="Postal Code"
                                    className={inputCls}
                                />
                                <input
                                    type="text"
                                    value="Dhaka"
                                    disabled
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-500"
                                />
                            </div>
                        </div>
                        {(errors.flat || errors.road || errors.postal_code) && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.flat || errors.road || errors.postal_code}
                            </p>
                        )}
                        <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                            Address will be saved to your profile for future orders.
                        </p>
                    </div>

                    {/* Delivery instructions */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Note for Delivery Man <span className="font-normal text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            placeholder="e.g. Call before arriving, leave with guard, ring bell twice..."
                            rows={2}
                            className={inputCls + ' resize-none'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
