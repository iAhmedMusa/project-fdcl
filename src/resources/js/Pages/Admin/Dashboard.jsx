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

const STATUS_CHART_COLORS = {
    Pending:    '#f97316',
    Processing: '#3b82f6',
    Ready:      '#f59e0b',
    Delivered:  '#22c55e',
    Cancelled:  '#ef4444',
};

const TOOLTIP_STYLE = {
    contentStyle: { backgroundColor: '#0D1B2A', border: 'none', borderRadius: '8px' },
    labelStyle:   { color: '#fff' },
    itemStyle:    { color: '#D4A017' },
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

    return (
        <AdminLayout>
            <Head title="Admin Dashboard - FDCL" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <h1 className="mb-4 text-lg font-semibold text-foreground">Dashboard</h1>

                <DashboardFilterBar locations={locations} filters={filters} baseRoute="/admin" />

                {/* ── Row A: Core KPIs ─────────────────────────────────────── */}
                <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">{stats.today_orders}</p>
                            </div>
                            <div className="rounded-full bg-secondary p-3">
                                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                                <p className="mt-1 text-3xl font-bold text-primary">{fmt(stats.today_revenue)}</p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3">
                                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                                <p className="mt-1 text-3xl font-bold text-amber-600">{stats.pending_orders}</p>
                            </div>
                            <div className="rounded-full bg-amber-50 p-3">
                                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Unpaid Balance</p>
                                <p className="mt-1 text-3xl font-bold text-red-600">{fmt(stats.unpaid_balance)}</p>
                            </div>
                            <div className="rounded-full bg-red-50 p-3">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Row B: Extended KPIs ──────────────────────────────────── */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Monthly Revenue */}
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">This Month's Revenue</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{fmt(stats.monthly_revenue)}</p>
                        {delta !== null && (
                            <p className={`mt-1 text-xs font-medium ${parseFloat(delta) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {parseFloat(delta) >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last month
                            </p>
                        )}
                    </div>

                    {/* Appointments */}
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Studio Appointments</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{appointment_stats.today ?? 0} today</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {appointment_stats.this_week ?? 0} this week · {appointment_stats.attendance_rate ?? 0}% attended
                        </p>
                    </div>

                    {/* New Customers */}
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{stats.new_customers_month}</p>
                        <p className="mt-1 text-xs text-muted-foreground">joined this month</p>
                    </div>

                    {/* Overdue Unpaid */}
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Overdue Unpaid</p>
                        <p className={`mt-1 text-2xl font-bold ${stats.overdue_unpaid_count > 0 ? 'text-amber-600' : 'text-foreground'}`}>
                            {stats.overdue_unpaid_count}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">orders 7+ days unpaid</p>
                    </div>
                </div>

                {/* ── SMS Balance ──────────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="rounded-lg bg-card p-4 shadow-sm sm:max-w-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-muted-foreground">BulkSMS Balance</p>
                            <button
                                onClick={fetchSmsBalance}
                                disabled={smsLoading}
                                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                Refresh
                            </button>
                        </div>

                        <p className="text-2xl font-bold text-foreground mb-3">
                            {smsLoading
                                ? <span className="text-muted-foreground text-base">Loading…</span>
                                : smsError
                                    ? <span className="text-red-500 text-base">Failed</span>
                                    : smsBalance !== null
                                        ? smsBalance
                                        : <span className="text-muted-foreground text-sm">—</span>
                            }
                        </p>

                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => setSmsType('masking')}
                                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold border transition-colors ${smsType === 'masking' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
                            >
                                Masking
                            </button>
                            <button
                                onClick={() => setSmsType('non-masking')}
                                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold border transition-colors ${smsType === 'non-masking' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
                            >
                                Non-Masking
                            </button>
                        </div>

                        {smsBalance !== null && !smsLoading && !smsError && (
                            <p className="text-xs text-muted-foreground">
                                ≈ <span className="font-bold text-foreground text-sm">
                                    {Math.floor(parseFloat(smsBalance) / (smsType === 'masking' ? 0.55 : 0.35)).toLocaleString()}
                                </span> SMS available
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Revenue by Service stat ──────────────────────────────── */}
                <div className="mb-6 rounded-lg bg-card p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">Revenue by Service</h2>
                        <select
                            value={serviceLocFilter}
                            onChange={(e) => setServiceLocFilter(e.target.value)}
                            className="h-8 rounded-md border bg-background px-2 text-xs"
                        >
                            <option value="">All Locations</option>
                            {locations.map((l) => (
                                <option key={l.id} value={String(l.id)}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    {serviceRows.every((r) => r.revenue === 0) ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No service revenue data for the selected period.</p>
                    ) : (
                        <div className="space-y-3">
                            {serviceRows.filter((r) => r.revenue > 0).map((row) => (
                                <div key={row.category}>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                                style={{ backgroundColor: SERVICE_COLORS[row.category] ?? '#9CA3AF' }}
                                            />
                                            <span className="font-medium text-foreground">{row.label}</span>
                                            <span className="text-muted-foreground">({row.order_count} {row.order_count === 1 ? 'order' : 'orders'})</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">{row.pct}%</span>
                                            <span className="w-24 text-right font-bold text-foreground">{fmt(row.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{ width: `${row.pct}%`, backgroundColor: SERVICE_COLORS[row.category] ?? '#9CA3AF' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                        <span className="font-semibold uppercase tracking-wide text-muted-foreground">Total</span>
                        <span className="font-bold text-foreground">{fmt(serviceTotal)}</span>
                    </div>
                </div>

                {/* ── Row C: Monthly Trend + Payment Methods ────────────────── */}
                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">6-Month Revenue Trend</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthly_trend}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tickFormatter={monthLabel} stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
                                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => fmt(v)} />
                                    <Area type="monotone" dataKey="revenue" stroke="#D4A017" strokeWidth={2} fill="url(#revGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Payment Methods</h2>
                        <div className="h-56">
                            {payment_methods.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={payment_methods}
                                            dataKey="amount"
                                            nameKey="method"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                        >
                                            {payment_methods.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...TOOLTIP_STYLE} formatter={(v) => fmt(v)} />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No payment data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Row D: Weekly Orders + Revenue by Service ─────────────── */}
                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Orders (Last 7 Days)</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weekly_orders}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} />
                                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: '#D4A017' }} />
                                    <Line type="monotone" dataKey="count" stroke="#D4A017" strokeWidth={3} dot={{ fill: '#D4A017', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Revenue by Service</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenue_by_service} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={fmt} />
                                    <YAxis type="category" dataKey="category" stroke="#9CA3AF" fontSize={12} width={80} />
                                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: '#fff' }} formatter={(v) => fmt(v)} />
                                    <Bar dataKey="revenue" fill="#0D1B2A" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Row E: Location Pie + Top Products ───────────────────── */}
                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Orders by Location</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orders_by_location}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        label={({ name, count }) => `${name}: ${count}`}
                                        labelLine={false}
                                    >
                                        {orders_by_location.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 flex justify-center gap-4">
                            {orders_by_location.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Top 5 Products</h2>
                        <div className="h-56">
                            {top_products.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={top_products} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={fmt} />
                                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={100} />
                                        <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: '#fff' }} formatter={(v) => fmt(v)} />
                                        <Bar dataKey="revenue" fill="#D4A017" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No product data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Row F: Status Distribution + Recent Orders ────────────── */}
                <div className="mb-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg bg-card p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Order Status</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={order_status_dist} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} allowDecimals={false} />
                                    <YAxis type="category" dataKey="status" stroke="#9CA3AF" fontSize={12} width={72} />
                                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: '#fff' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {order_status_dist.map((entry, i) => (
                                            <Cell key={i} fill={STATUS_CHART_COLORS[entry.status] ?? '#9CA3AF'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-lg bg-card p-4 shadow-sm lg:col-span-2">
                        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y border-b">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Order #</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recent_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-muted">
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className="font-mono text-sm font-bold text-primary">{order.order_number}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">{order.user.name}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{order.location.name}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-foreground">{fmt(order.total_amount)}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 text-center">
                            <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
                                View All Orders →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
