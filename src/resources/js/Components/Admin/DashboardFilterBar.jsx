import { router } from '@inertiajs/react';
import { useState } from 'react';

const PRESETS = [
    { label: 'Today',      key: 'today' },
    { label: 'This Week',  key: 'week' },
    { label: 'This Month', key: 'month' },
    { label: 'Last Month', key: 'last_month' },
    { label: 'Custom',     key: 'custom' },
];

function getPresetDates(key) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (key === 'today') {
        const t = fmt(now);
        return { date_from: t, date_to: t };
    }
    if (key === 'week') {
        const mon = new Date(now);
        mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        return { date_from: fmt(mon), date_to: fmt(sun) };
    }
    if (key === 'month') {
        return {
            date_from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
            date_to:   fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
        };
    }
    if (key === 'last_month') {
        const m = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return {
            date_from: fmt(new Date(y, m, 1)),
            date_to:   fmt(new Date(y, m + 1, 0)),
        };
    }
    return { date_from: '', date_to: '' };
}

export default function DashboardFilterBar({ locations = [], filters = {}, baseRoute = '/admin' }) {
    const [preset, setPreset]         = useState('month');
    const [dateFrom, setDateFrom]     = useState(filters.date_from ?? '');
    const [dateTo, setDateTo]         = useState(filters.date_to   ?? '');
    const [locationId, setLocationId] = useState(filters.location_id ?? '');

    function apply(dates) {
        const params = { ...dates };
        if (locationId) params.location_id = locationId;
        router.get(baseRoute, params, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handlePreset(key) {
        setPreset(key);
        if (key !== 'custom') {
            const d = getPresetDates(key);
            setDateFrom(d.date_from);
            setDateTo(d.date_to);
            apply(d);
        }
    }

    function handleLocation(val) {
        setLocationId(val);
        const dates = preset !== 'custom' ? getPresetDates(preset) : { date_from: dateFrom, date_to: dateTo };
        const params = { ...dates };
        if (val) params.location_id = val;
        router.get(baseRoute, params, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm">
            {/* Period label */}
            <span className="mr-1 text-xs font-medium text-muted-foreground">Period:</span>

            {/* Preset pills */}
            <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => handlePreset(p.key)}
                        className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                            preset === p.key
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'border text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Custom date range */}
            {preset === 'custom' && (
                <div className="flex items-center gap-2">
                    <div className="h-4 w-px bg-border" />
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-8 rounded-lg border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-8 rounded-lg border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                        onClick={() => apply({ date_from: dateFrom, date_to: dateTo })}
                        disabled={!dateFrom || !dateTo}
                        className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Location filter */}
            <div className="ml-auto flex items-center gap-2">
                {locations.length > 0 && (
                    <div className="relative">
                        <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <select
                            value={locationId}
                            onChange={(e) => handleLocation(e.target.value)}
                            className="h-8 cursor-pointer appearance-none rounded-lg border bg-background pl-8 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Locations</option>
                            {locations.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
