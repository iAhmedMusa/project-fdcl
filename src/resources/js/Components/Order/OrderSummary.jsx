export default function OrderSummary({ items, products, locationName, pickupType }) {
    const total = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return sum;
        return sum + item.quantity * parseFloat(product.price);
    }, 0);

    const pickupLabel = pickupType === 'delivery' ? 'Home Delivery' : 'Studio Pickup';

    return (
        <div>
            {/* Items Table */}
            <div className="rounded-lg border border-white/10 overflow-hidden">
                {/* Header — desktop only */}
                <div className="hidden border-b border-white/10 bg-white/[0.03] px-4 py-2.5 sm:grid sm:grid-cols-12 sm:gap-4">
                    <span className="col-span-5 text-xs font-medium text-white/50">Product</span>
                    <span className="col-span-2 text-xs font-medium text-white/50">Size</span>
                    <span className="col-span-1 text-center text-xs font-medium text-white/50">Qty</span>
                    <span className="col-span-2 text-right text-xs font-medium text-white/50">Price</span>
                    <span className="col-span-2 text-right text-xs font-medium text-white/50">Subtotal</span>
                </div>

                {items.map((item) => {
                    const product = products.find((p) => p.id === item.product_id);
                    if (!product) return null;
                    const subtotal = item.quantity * parseFloat(product.price);

                    return (
                        <div
                            key={item.product_id}
                            className="border-b border-white/5 px-4 py-3 last:border-b-0"
                        >
                            {/* Mobile layout */}
                            <div className="flex items-center justify-between sm:hidden">
                                <div>
                                    <p className="text-sm font-medium text-white">{product.name}</p>
                                    <p className="text-xs text-white/40">
                                        {product.size_label} × {item.quantity} — ৳{parseFloat(product.price).toFixed(0)} each
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-gold">
                                    ৳{subtotal.toFixed(0)}
                                </span>
                            </div>

                            {/* Desktop layout */}
                            <div className="hidden sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                                <span className="col-span-5 text-sm text-white">{product.name}</span>
                                <span className="col-span-2 text-sm text-white/50">{product.size_label}</span>
                                <span className="col-span-1 text-center text-sm text-white/50">{item.quantity}</span>
                                <span className="col-span-2 text-right text-sm text-white/50">৳{parseFloat(product.price).toFixed(0)}</span>
                                <span className="col-span-2 text-right text-sm font-medium text-gold">৳{subtotal.toFixed(0)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Location, Pickup Type & Total */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                    {locationName && (
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            {locationName}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-white/50">
                        <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m6 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h-6m6 0h3" />
                        </svg>
                        {pickupLabel}
                        {pickupType === 'delivery' && (
                            <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                                Coming Soon
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm text-white/50">Total: </span>
                    <span className="text-2xl font-bold text-gold">৳{total.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
}