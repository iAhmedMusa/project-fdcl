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
        mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday
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
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border bg-card px-4 py-3">
            {PRESETS.map((p) => (
                <button
                    key={p.key}
                    onClick={() => handlePreset(p.key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        preset === p.key
                            ? 'bg-primary text-primary-foreground'
                            : 'border text-muted-foreground hover:bg-muted'
                    }`}
                >
                    {p.label}
                </button>
            ))}

            {preset === 'custom' && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                    />
                    <button
                        onClick={() => apply({ date_from: dateFrom, date_to: dateTo })}
                        disabled={!dateFrom || !dateTo}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                    >
                        Apply
                    </button>
                </div>
            )}

            <div className="ml-auto">
                <select
                    value={locationId}
                    onChange={(e) => handleLocation(e.target.value)}
                    className="h-8 rounded-md border bg-background px-2 text-xs"
                >
                    <option value="">All Locations</option>
                    {locations.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
