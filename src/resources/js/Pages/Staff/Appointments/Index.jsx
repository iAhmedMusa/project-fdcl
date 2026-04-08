import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

const SERVICE_LABELS = {
    passport: 'Passport / Stamp Size',
    school: 'School / Official Size',
    visa: 'Visa Photo',
    general: 'General Portrait',
    family: 'Family Photo',
    event: 'Event / Occasion',
};

const STATUS_STYLES = {
    pending:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    attended:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const FINAL_STATUSES = ['attended', 'cancelled', 'completed'];

function AppointmentRow({ appt }) {
    const [pending, setPending] = useState(null); // 'attended' | 'cancelled'

    function confirm(status) {
        router.patch(`/staff/appointments/${appt.id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => setPending(null),
        });
    }

    const isFinal = FINAL_STATUSES.includes(appt.status);

    return (
        <tr className="hover:bg-muted/30">
            <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-medium">{appt.appointment_date}</p>
                <p className="text-xs text-muted-foreground">{appt.appointment_time}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                {SERVICE_LABELS[appt.service_type] ?? appt.service_type}
            </td>
            <td className="px-4 py-3">
                {appt.customer_name && (
                    <p className="font-medium">{appt.customer_name}</p>
                )}
                <p className="text-xs">{appt.customer_phone ?? '—'}</p>
                {appt.customer_email && (
                    <p className="text-xs text-muted-foreground">{appt.customer_email}</p>
                )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {appt.location}
            </td>
            <td className="px-4 py-3 max-w-[180px]">
                <p className="truncate text-muted-foreground">{appt.notes ?? '—'}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[appt.status] ?? ''}`}>
                    {appt.status}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                <p>{appt.booked_by}</p>
                <p className="text-xs">{appt.created_at}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                {isFinal ? (
                    <span className="text-xs text-muted-foreground">—</span>
                ) : pending ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                            Mark as <span className="font-medium capitalize">{pending}</span>?
                        </span>
                        <button
                            onClick={() => confirm(pending)}
                            className={`rounded px-2 py-1 text-xs font-medium text-white ${
                                pending === 'attended' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setPending(null)}
                            className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPending('attended')}
                            className="rounded border border-green-600 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                        >
                            Attended
                        </button>
                        <button
                            onClick={() => setPending('cancelled')}
                            className="rounded border border-red-400 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default function AppointmentsIndex({ appointments }) {
    return (
        <StaffLayout>
            <Head title="Appointments - FDCL Staff" />

            <div className="mb-5">
                <h1 className="text-lg font-semibold">Appointments</h1>
                <p className="text-sm text-muted-foreground">Studio booking requests from customers.</p>
            </div>

            {appointments.length === 0 ? (
                <div className="rounded-lg border border-dashed p-10 text-center">
                    <p className="text-sm text-muted-foreground">No appointments yet.</p>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date & Time</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Notes</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booked by</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {appointments.map((appt) => (
                                    <AppointmentRow key={appt.id} appt={appt} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
