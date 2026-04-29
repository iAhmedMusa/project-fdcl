import { useEffect, useRef, useState } from 'react';

/**
 * Reusable custom dropdown.
 *
 * options:  [{ value, label, subtitle?, icon? }]
 * onChange: (value) => void  — receives the raw value, not an event
 * variant:  'light' (default) | 'dark'  — dark for navy-bg pages (Wizard)
 * compact:  true — smaller trigger, used inside tight grids
 */
export default function CustomSelect({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    error,
    variant = 'light',
    compact = false,
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find((o) => String(o.value) === String(value));
    const isDark = variant === 'dark';

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const triggerPy = compact ? 'py-2' : 'py-3';
    const triggerPx = compact ? 'px-3' : 'px-4';

    const triggerCls = [
        `flex w-full items-center justify-between gap-2 rounded-lg border ${triggerPx} ${triggerPy} text-sm transition-colors focus:outline-none`,
        isDark
            ? `border-white/20 bg-navy-light text-white hover:border-white/30 focus:border-gold focus:ring-1 focus:ring-gold ${open ? 'border-gold ring-1 ring-gold' : ''}`
            : `bg-white dark:bg-gray-800 ${open ? 'border-primary ring-1 ring-primary' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`,
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ].join(' ');

    const dropdownCls = isDark
        ? 'border-white/20 bg-navy-light'
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';

    const iconBoxCls = compact
        ? `flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm leading-none ${isDark ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-700'}`
        : `flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-base leading-none ${isDark ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-700'}`;

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={triggerCls}
            >
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    {selected ? (
                        <>
                            {selected.icon && (
                                <span className={iconBoxCls}>{selected.icon}</span>
                            )}
                            <span className="min-w-0 flex-1">
                                <span className={`block truncate font-medium ${isDark ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {selected.label}
                                </span>
                                {selected.subtitle && (
                                    <span className={`block truncate text-xs ${isDark ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {selected.subtitle}
                                    </span>
                                )}
                            </span>
                        </>
                    ) : (
                        <span className={isDark ? 'text-white/40' : 'text-gray-400 dark:text-gray-500'}>
                            {placeholder}
                        </span>
                    )}
                </span>
                <svg
                    className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${isDark ? 'text-white/50' : 'text-gray-400'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className={`absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border shadow-lg ${dropdownCls}`}>
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = String(value) === String(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { onChange(option.value); setOpen(false); }}
                                    className={[
                                        'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                                        isSelected
                                            ? (isDark ? 'bg-gold/10' : 'bg-primary/5 dark:bg-primary/10')
                                            : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'),
                                    ].join(' ')}
                                >
                                    {option.icon && (
                                        <span className={iconBoxCls}>{option.icon}</span>
                                    )}
                                    <span className="min-w-0 flex-1">
                                        <span className={`block truncate font-medium ${isDark ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {option.label}
                                        </span>
                                        {option.subtitle && (
                                            <span className={`block truncate text-xs ${isDark ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {option.subtitle}
                                            </span>
                                        )}
                                    </span>
                                    {isSelected && (
                                        <svg className={`h-4 w-4 shrink-0 ${isDark ? 'text-gold' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
