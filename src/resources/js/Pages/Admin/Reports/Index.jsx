import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardFilterBar from '@/Components/Admin/DashboardFilterBar';

const REPORT_TYPES = [
    { key: 'sales',        label: 'Sales' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'customers',    label: 'Customers' },
    { key: 'products',     label: 'Product Performance' },
];

export default function ReportsIndex({ report_data = [], total_rows = 0, report_type, locations = [], summary = {}, filters = {} }) {
    const columns = report_data.length > 0 ? Object.keys(report_data[0]) : [];

    function switchType(type) {
        router.get('/admin/reports', { ...filters, type }, { preserveState: true, replace: true });
    }

    function buildDownloadUrl(format) {
        const params = new URLSearchParams({ ...(filters.date_from ? { date_from: filters.date_from } : {}), ...(filters.date_to ? { date_to: filters.date_to } : {}), ...(filters.location_id ? { location_id: filters.location_id } : {}), type: report_type, format });
        return `/admin/reports/download?${params.toString()}`;
    }

    return (
        <AdminLayout>
            <Head title="Reports - FDCL" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-foreground">Reports</h1>
                    <div className="flex items-center gap-2">
                        <a
                            href={buildDownloadUrl('pdf')}
                            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Download PDF
                        </a>
                        <a
                            href={buildDownloadUrl('csv')}
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download CSV
                        </a>
                    </div>
                </div>

                {/* Report type tabs */}
                <div className="mb-4 flex gap-1 rounded-lg border bg-muted/40 p-1">
                    {REPORT_TYPES.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => switchType(t.key)}
                            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                                report_type === t.key
                                    ? 'bg-card shadow-sm text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <DashboardFilterBar locations={locations} filters={filters} baseRoute="/admin/reports" />

                {/* Summary tiles */}
                {Object.keys(summary).length > 0 && (
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(summary).map(([label, value]) => (
                            <div key={label} className="rounded-lg bg-card p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                                <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Preview table */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            {REPORT_TYPES.find((t) => t.key === report_type)?.label} Report
                        </h2>
                        {total_rows > 100 && (
                            <span className="text-xs text-muted-foreground">
                                Showing first 100 of {total_rows} rows — download for full data
                            </span>
                        )}
                        {total_rows === 0 && (
                            <span className="text-xs text-muted-foreground">No data</span>
                        )}
                    </div>

                    {report_data.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            No data for the selected period.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {report_data.map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/30">
                                            {columns.map((col) => (
                                                <td key={col} className="whitespace-nowrap px-4 py-2.5 text-xs text-foreground">
                                                    {row[col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
