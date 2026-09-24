import { useState, useMemo, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardFilterBar from '@/Components/Admin/DashboardFilterBar';
import {
    LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

const STATUS_COLORS = {
    pending:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ready:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    delivered:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_DOT = {
    pending:    'bg-gray-400',
    processing: 'bg-blue-500',
    ready:      'bg-amber-500',
    delivered:  'bg-green-500',
    cancelled:  'bg-red-500',
};

const STATUS_CHART_COLORS = {
    Pending:    '#f97316',
    Processing: '#3b82f6',
    Ready:      '#f59e0b',
    Delivered:  '#22c55e',
    Cancelled:  '#ef4444',
};

const TOOLTIP_STYLE = {
    contentStyle: { backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' },
    labelStyle:   { color: '#fff', fontWeight: 600 },
    itemStyle:    { color: '#E8C547' },
};

const SERVICE_LABELS = {
    photo_studio: 'Photo Print & Photo ID',
    reprint:      'Upload / Visa Photo',
    album:        'Album',
    frame:        'Frame',
    mug:          'Mug',
};

const SERVICE_ORDER = ['photo_studio', 'reprint', 'album', 'frame', 'mug'];

const SERVICE_COLORS = {
    photo_studio: '#D4A017',
    reprint:      '#3b82f6',
    album:        '#22c55e',
    frame:        '#f97316',
    mug:          '#a855f7',
};

function SectionHeader({ title }) {
    return (
        <div className="flex items-center gap-3">
            <h2 className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            <div className="h-px flex-1 bg-border" />
        </div>
    );
}

function Card({ className = '', children }) {
    return (
        <div className={`rounded-xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
            {children}
        </div>
    );
}

const KPI_TONES = {
    blue:   { icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', value: 'text-foreground' },
    gold:   { icon: 'bg-[#D4A017]/10 text-[#9a7a10] dark:text-[#D4A017]', value: 'text-foreground' },
    amber:  { icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', value: 'text-foreground' },
    red:    { icon: 'bg-red-500/10 text-red-600 dark:text-red-400', value: 'text-foreground' },
    purple: { icon: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', value: 'text-foreground' },
    teal:   { icon: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', value: 'text-foreground' },
    neutral:{ icon: 'bg-muted text-muted-foreground', value: 'text-foreground' },
};

function KpiCard({ label, value, sub, tone = 'neutral', icon, valueClass }) {
    const t = KPI_TONES[tone] ?? KPI_TONES.neutral;
    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-border">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${valueClass ?? t.value}`}>{value}</p>
                    {sub && <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{sub}</p>}
                </div>
                {icon && (
                    <div className={`shrink-0 rounded-lg p-2.5 ${t.icon}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({
    stats, weekly_orders, revenue_by_service, orders_by_location, recent_orders,
    monthly_trend = [], payment_methods = [], top_products = [], order_status_dist = [],
    appointment_stats = {}, locations = [], filters = {},
    revenue_by_service_location = [],
}) {
    const COLORS = ['#D4A017', '#0D1B2A', '#4f8ef7', '#22c55e', '#f97316'];

    const fmt = (value) => `৳${Number(value).toLocaleString()}`;

    const [serviceLocFilter, setServiceLocFilter] = useState('');
    const [smsBalance, setSmsBalance] = useState(null);
    const [smsLoading, setSmsLoading] = useState(false);
    const [smsError, setSmsError] = useState(false);
    const [smsType, setSmsType] = useState('non-masking');

    const fetchSmsBalance = useCallback(() => {
        setSmsLoading(true);
        setSmsError(false);
        fetch('/admin/sms-balance')
            .then((r) => r.json())
            .then((data) => {
                setSmsBalance(data.balance);
                setSmsLoading(false);
            })
            .catch(() => {
                setSmsError(true);
                setSmsLoading(false);
            });
    }, []);

    const serviceRows = useMemo(() => {
        const filtered = serviceLocFilter
            ? revenue_by_service_location.filter((r) => String(r.location_id) === serviceLocFilter)
            : revenue_by_service_location;

        const byCategory = {};
        filtered.forEach((r) => {
            if (!byCategory[r.category]) byCategory[r.category] = { revenue: 0, order_count: 0 };
            byCategory[r.category].revenue     += r.revenue;
            byCategory[r.category].order_count += r.order_count;
        });

        const total = Object.values(byCategory).reduce((sum, v) => sum + v.revenue, 0);

        return SERVICE_ORDER.map((cat) => ({
            category:    cat,
            label:       SERVICE_LABELS[cat] ?? cat,
            revenue:     byCategory[cat]?.revenue     ?? 0,
            order_count: byCategory[cat]?.order_count ?? 0,
            pct:         total > 0 ? ((byCategory[cat]?.revenue ?? 0) / total * 100).toFixed(1) : '0.0',
        }));
    }, [revenue_by_service_location, serviceLocFilter]);

    const serviceTotal = useMemo(
        () => serviceRows.reduce((s, r) => s + r.revenue, 0),
        [serviceRows],
    );

    const monthLabel = (m) => {
        try { return new Date(m + '-01').toLocaleString('default', { month: 'short' }); }
        catch { return m; }
    };

    const delta = stats.monthly_revenue_prev > 0
        ? (((stats.monthly_revenue - stats.monthly_revenue_prev) / stats.monthly_revenue_prev) * 100).toFixed(1)
        : null;

    const smsEstimate = smsBalance !== null && !smsLoading && !smsError
        ? Math.floor(parseFloat(smsBalance) / (smsType === 'masking' ? 0.55 : 0.35)).toLocaleString()
        : null;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard - FDCL" />

            <div className="space-y-6">
                {/* Page title */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Overview of orders, revenue, and operations.</p>
                </div>

                <DashboardFilterBar locations={locations} filters={filters} baseRoute="/admin" />

                {/* ── Row A: Core KPIs ─────────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        label="Today's Orders"
                        value={stats.today_orders}
                        tone="blue"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Today's Revenue"
                        value={fmt(stats.today_revenue)}
                        tone="gold"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Pending Orders"
                        value={stats.pending_orders}
                        tone="amber"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Unpaid Balance"
                        value={fmt(stats.unpaid_balance)}
                        tone="red"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        }
                    />
                </div>

                {/* ── Row B: Extended KPIs ──────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        label="This Month's Revenue"
                        value={fmt(stats.monthly_revenue)}
                        tone="gold"
                        sub={delta !== null
                            ? `${parseFloat(delta) >= 0 ? '↑' : '↓'} ${Math.abs(delta)}% vs last month`
                            : undefined
                        }
                    />
                    <KpiCard
                        label="Studio Appointments"
                        value={`${appointment_stats.today ?? 0} today`}
                        tone="purple"
                        sub={`${appointment_stats.this_week ?? 0} this week · ${appointment_stats.attendance_rate ?? 0}% attended`}
                    />
                    <KpiCard
                        label="New Customers"
                        value={stats.new_customers_month}
                        tone="teal"
                        sub="joined this month"
                    />
                    <KpiCard
                        label="Overdue Unpaid"
                        value={stats.overdue_unpaid_count}
                        tone={stats.overdue_unpaid_count > 0 ? 'amber' : 'neutral'}
                        sub="orders 7+ days unpaid"
                    />
                </div>

                {/* ── SMS Balance + Revenue by Service ─────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* SMS Balance */}
                    <Card>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-foreground">BulkSMS Balance</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">Available credits</p>
                            </div>
                            <button
                                onClick={fetchSmsBalance}
                                disabled={smsLoading}
                                className="shrink-0 cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {smsLoading ? 'Loading…' : 'Refresh'}
                            </button>
                        </div>

                        <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                            {smsLoading
                                ? <span className="text-base font-normal text-muted-foreground">Fetching…</span>
                                : smsError
                                    ? <span className="text-base font-normal text-red-500">Failed to load</span>
                                    : smsBalance !== null
                                        ? smsBalance
                                        : <span className="text-base font-normal text-muted-foreground">Not loaded — press Refresh</span>
                            }
                        </p>

                        <div className="mt-4 flex gap-2">
                            {['masking', 'non-masking'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSmsType(type)}
                                    className={`flex-1 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.98] ${
                                        smsType === type
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {smsEstimate && (
                            <p className="mt-3 text-xs tabular-nums text-muted-foreground">
                                ≈ <span className="font-bold text-foreground">{smsEstimate}</span> SMS available
                            </p>
                        )}
                    </Card>

                    {/* Revenue by Service */}
                    <Card className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-foreground">Revenue by Service</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">Breakdown for selected period</p>
                            </div>
                            <div className="relative">
                                <select
                                    value={serviceLocFilter}
                                    onChange={(e) => setServiceLocFilter(e.target.value)}
                                    className="h-8 cursor-pointer appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((l) => (
                                        <option key={l.id} value={String(l.id)}>{l.name}</option>
                                    ))}
                                </select>
                                <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>

                        {serviceRows.every((r) => r.revenue === 0) ? (
                            <div className="flex flex-col items-center gap-1 py-8 text-center">
                                <p className="text-sm font-medium text-foreground">No service revenue for selected period.</p>
                                <p className="text-xs text-muted-foreground">Try a different period or location.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {serviceRows.filter((r) => r.revenue > 0).map((row) => (
                                    <div key={row.category}>
                                        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{ backgroundColor: SERVICE_COLORS[row.category] ?? '#9CA3AF' }}
                                                />
                                                <span className="truncate font-medium text-foreground">{row.label}</span>
                                                <span className="shrink-0 tabular-nums text-muted-foreground">{row.order_count} {row.order_count === 1 ? 'order' : 'orders'}</span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3 tabular-nums">
                                                <span className="text-muted-foreground">{row.pct}%</span>
                                                <span className="w-20 text-right font-bold text-foreground">{fmt(row.revenue)}</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${row.pct}%`,
                                                    background: SERVICE_COLORS[row.category] ?? '#9CA3AF',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs tabular-nums">
                            <span className="font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
                            <span className="font-bold text-foreground">{fmt(serviceTotal)}</span>
                        </div>
                    </Card>
                </div>

                {/* ── Row C: Monthly Trend + Payment Methods ────────────────── */}
                <SectionHeader title="Trends & Payments" />
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">6-Month Revenue Trend</p>
                        <p className="mb-4 text-xs tabular-nums text-muted-foreground">{delta !== null ? `${parseFloat(delta) >= 0 ? '+' : ''}${delta}% vs last month` : 'Last 6 months'}</p>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthly_trend}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4A017" stopOpacity={0.28} />
                                            <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} vertical={false} />
                                    <XAxis dataKey="month" tickFormatter={monthLabel} stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} width={44} />
                                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), 'Revenue']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#D4A017" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#D4A017', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Payment Methods</p>
                        <p className="mb-4 text-xs text-muted-foreground">Share by amount collected</p>
                        <div className="h-60">
                            {payment_methods.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={payment_methods}
                                            dataKey="amount"
                                            nameKey="method"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            strokeWidth={0}
                                        >
                                            {payment_methods.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), 'Amount']} />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                                    <p className="text-sm font-medium text-foreground">No payment data</p>
                                    <p className="text-xs text-muted-foreground">Payments will appear here once orders are paid.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ── Row D: Weekly Orders + Revenue by Service Chart ───────── */}
                <SectionHeader title="Activity" />
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Orders — Last 7 Days</p>
                        <p className="mb-4 text-xs text-muted-foreground">Daily order volume</p>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weekly_orders}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} vertical={false} />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
                                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Orders']} />
                                    <Line type="monotone" dataKey="count" stroke="#D4A017" strokeWidth={2.5} dot={{ fill: '#D4A017', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Revenue by Service</p>
                        <p className="mb-4 text-xs text-muted-foreground">All locations, selected period</p>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenue_by_service} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} horizontal={false} />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt} />
                                    <YAxis type="category" dataKey="category" stroke="#9CA3AF" fontSize={11} width={85} tickLine={false} axisLine={false} />
                                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), 'Revenue']} />
                                    <Bar dataKey="revenue" fill="#D4A017" radius={[0, 6, 6, 0]} barSize={18} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* ── Row E: Location + Top Products ───────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Orders by Location</p>
                        <p className="mb-4 text-xs text-muted-foreground">Distribution of orders</p>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orders_by_location}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="count"
                                        strokeWidth={0}
                                    >
                                        {orders_by_location.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...TOOLTIP_STYLE} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
                            {orders_by_location.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs tabular-nums text-muted-foreground">{item.name} · {item.count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Top 5 Products</p>
                        <p className="mb-4 text-xs text-muted-foreground">By revenue</p>
                        <div className="h-60">
                            {top_products.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={top_products} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} horizontal={false} />
                                        <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt} />
                                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={105} tickLine={false} axisLine={false} />
                                        <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), 'Revenue']} />
                                        <Bar dataKey="revenue" fill="#D4A017" radius={[0, 6, 6, 0]} barSize={18} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                                    <p className="text-sm font-medium text-foreground">No product data</p>
                                    <p className="text-xs text-muted-foreground">Top sellers will appear here.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ── Row F: Status Distribution + Recent Orders ────────────── */}
                <SectionHeader title="Orders Overview" />
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <p className="mb-1 text-sm font-semibold tracking-tight text-foreground">Order Status</p>
                        <p className="mb-4 text-xs text-muted-foreground">Current queue</p>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={order_status_dist} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} horizontal={false} />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <YAxis type="category" dataKey="status" stroke="#9CA3AF" fontSize={11} width={75} tickLine={false} axisLine={false} />
                                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Orders']} />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                                        {order_status_dist.map((entry, i) => (
                                            <Cell key={i} fill={STATUS_CHART_COLORS[entry.status] ?? '#9CA3AF'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-foreground">Recent Orders</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">Latest activity across locations</p>
                            </div>
                            <Link href="/admin/orders" className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 active:scale-[0.98]">
                                View all →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                                        <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {recent_orders.map((order) => (
                                        <tr key={order.id} className="group transition-colors hover:bg-muted/50">
                                            <td className="whitespace-nowrap py-3 pr-4">
                                                <Link href={`/admin/orders/${order.order_number}`} className="cursor-pointer font-mono text-xs font-bold text-primary hover:underline">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap py-3 pr-4 text-sm text-foreground">{order.user.name}</td>
                                            <td className="whitespace-nowrap py-3 pr-4 text-sm text-muted-foreground">{order.location.name}</td>
                                            <td className="whitespace-nowrap py-3 pr-4 text-right text-sm font-semibold tabular-nums text-foreground">{fmt(order.total_amount)}</td>
                                            <td className="whitespace-nowrap py-3 text-center">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[order.status]}`} />
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
