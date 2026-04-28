import { useState } from 'react';

const MERCHANT_NUMBER = '01973140768';

export default function BkashPaymentSection({ total, value, onChange, error, dark = false }) {
    const [copied, setCopied] = useState(false);

    function copyNumber() {
        navigator.clipboard.writeText(MERCHANT_NUMBER).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    if (dark) {
        return (
            <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20">
                        <span className="text-sm font-black text-pink-400">bK</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Pay via bKash</p>
                        <p className="text-xs text-white/50">Send money to our number before placing order</p>
                    </div>
                </div>

                <div className="mb-4 rounded-lg border border-pink-500/20 bg-pink-500/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">Merchant Number</p>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xl font-bold tracking-widest text-white">{MERCHANT_NUMBER}</span>
                        <button
                            type="button"
                            onClick={copyNumber}
                            className="rounded-lg border border-pink-500/30 px-3 py-1.5 text-xs font-medium text-pink-400 transition-colors hover:bg-pink-500/20"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    {total > 0 && (
                        <p className="mt-2 text-sm text-white/60">
                            Amount to send: <span className="font-bold text-white">৳{total.toFixed(0)}</span>
                        </p>
                    )}
                </div>

                <ol className="mb-4 space-y-1.5 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-[10px] font-bold text-pink-400">1</span>
                        Open your bKash app
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-[10px] font-bold text-pink-400">2</span>
                        Tap <span className="text-white font-medium mx-1">Make Payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-[10px] font-bold text-pink-400">3</span>
                        Enter <span className="font-mono text-white font-medium mx-1">{MERCHANT_NUMBER}</span> and send <span className="text-white font-medium mx-1">৳{total > 0 ? total.toFixed(0) : '...'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-[10px] font-bold text-pink-400">4</span>
                        Come back here and enter your Transaction ID or last 4 digits of your bKash number below
                    </li>
                </ol>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1.5">
                        Transaction ID or last 4 digits of your bKash number <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g. 8HG2A9WXYZ or 5678"
                        className="w-full rounded-lg border border-pink-500/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-pink-200 bg-pink-50 p-5 dark:border-pink-800 dark:bg-pink-900/20">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800/40">
                    <span className="text-sm font-black text-pink-600 dark:text-pink-400">bK</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Pay via bKash</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send money to our number before placing order</p>
                </div>
            </div>

            <div className="mb-4 rounded-lg border border-pink-200 bg-white p-4 dark:border-pink-800 dark:bg-pink-900/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1">Merchant Number</p>
                <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xl font-bold tracking-widest text-gray-900 dark:text-gray-100">{MERCHANT_NUMBER}</span>
                    <button
                        type="button"
                        onClick={copyNumber}
                        className="rounded-lg border border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition-colors hover:bg-pink-100 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-800/40"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                {total > 0 && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Amount to send: <span className="font-bold text-gray-900 dark:text-gray-100">৳{total.toFixed(0)}</span>
                    </p>
                )}
            </div>

            <ol className="mb-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800/40 text-[10px] font-bold text-pink-600 dark:text-pink-400">1</span>
                    Open your bKash app
                </li>
                <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800/40 text-[10px] font-bold text-pink-600 dark:text-pink-400">2</span>
                    Tap <span className="font-medium text-gray-900 dark:text-gray-100 mx-1">Make Payment</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800/40 text-[10px] font-bold text-pink-600 dark:text-pink-400">3</span>
                    Enter <span className="font-mono font-medium text-gray-900 dark:text-gray-100 mx-1">{MERCHANT_NUMBER}</span> and send <span className="font-medium text-gray-900 dark:text-gray-100 mx-1">৳{total > 0 ? total.toFixed(0) : '...'}</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800/40 text-[10px] font-bold text-pink-600 dark:text-pink-400">4</span>
                    Come back here and enter your Transaction ID or last 4 digits of your bKash number below
                </li>
            </ol>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1.5">
                    Transaction ID or last 4 digits of your bKash number <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. 8HG2A9WXYZ or 5678"
                    className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-pink-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        </div>
    );
}
