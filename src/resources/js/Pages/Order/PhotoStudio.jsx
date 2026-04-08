import InputError from '@/Components/InputError';
import LandingLayout from '@/Layouts/LandingLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const SERVICE_TYPES = [
    { value: 'passport', label: 'Passport / Stamp Size' },
    { value: 'school',   label: 'School / Official Size' },
    { value: 'visa',     label: 'Visa Photo' },
    { value: 'general',  label: 'General Portrait' },
    { value: 'family',   label: 'Family Photo' },
    { value: 'event',    label: 'Event / Occasion' },
];

// All possible slots (9:00 AM – 9:30 PM in 30-min steps)
const ALL_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM',
];

// Friday slots: 3:00 PM – 9:00 PM only
const FRIDAY_SLOTS = ALL_SLOTS.filter((s) => {
    const [time, period] = s.split(' ');
    const [h] = time.split(':').map(Number);
    const hour24 = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
    return hour24 >= 15 && hour24 <= 21;
});

function slotTo24h(slot) {
    const [time, period] = slot.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
}

function isFriday(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr + 'T00:00:00').getDay() === 5;
}

function getTodayString() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

// Returns the minimum selectable date.
// Today is disabled if the current time is past the last available slot:
//   Friday: past 9:00 PM  |  other days: past 9:30 PM
function getMinDate() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun … 5=Fri
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const cutoff = dayOfWeek === 5
        ? 21 * 60      // Friday closes at 9:00 PM
        : 21 * 60 + 30; // Other days close at 9:30 PM

    const today = getTodayString();
    if (currentMinutes >= cutoff) {
        // Today is over — move min to tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    return today;
}

const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
const inputClass  = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function PhotoStudio({ locations }) {
    const [locationId, setLocationId]           = useState(locations[0]?.id || '');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [serviceType, setServiceType]         = useState('');
    const [customerName, setCustomerName]       = useState('');
    const [customerPhone, setCustomerPhone]     = useState('');
    const [customerEmail, setCustomerEmail]     = useState('');
    const [notes, setNotes]                     = useState('');
    const [submitting, setSubmitting]           = useState(false);
    const [errors, setErrors]                   = useState({});

    const minDate = getMinDate();

    // Compute available time slots for the selected date
    const availableSlots = useMemo(() => {
        const now = new Date();
        const today = getTodayString();
        const isToday = appointmentDate === today;
        const friday = isFriday(appointmentDate);
        const baseSlots = friday ? FRIDAY_SLOTS : ALL_SLOTS;

        if (isToday) {
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            // Show only slots that haven't started yet (+ 15 min buffer)
            return baseSlots.filter((s) => slotTo24h(s) > currentMinutes + 15);
        }
        return baseSlots;
    }, [appointmentDate]);

    // Reset time if it's no longer in the available list
    const handleDateChange = (val) => {
        setAppointmentDate(val);
        setAppointmentTime('');
    };

    const canSubmit = locationId && appointmentDate && appointmentTime && serviceType && customerPhone.trim();

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        router.post('/order/photo-studio', {
            location_id: parseInt(locationId),
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            service_type: serviceType,
            customer_name: customerName || null,
            customer_phone: customerPhone,
            customer_email: customerEmail || null,
            notes: notes || null,
        }, {
            onError: (errs) => setErrors(errs),
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <LandingLayout>
            <Head title="Book Photo Studio - FDCL" />

            <div className="mx-auto max-w-2xl px-4 pt-32 pb-16 sm:px-6">
                <a href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to home
                </a>

                <div className="mb-6">
                    <h1 className="font-poppins text-2xl font-bold text-text-primary dark:text-white">Book a Studio Appointment</h1>
                    <p className="mt-1 text-sm text-text-secondary dark:text-gray-400">No account needed. Fill in your details and we'll be ready for you.</p>
                </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Service + Location */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium">Service type <span className="text-destructive">*</span></label>
                        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={selectClass + ' mt-1'}>
                            <option value="">Select...</option>
                            {SERVICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <InputError message={errors.service_type} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Location <span className="text-destructive">*</span></label>
                        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className={selectClass + ' mt-1'}>
                            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <InputError message={errors.location_id} className="mt-1" />
                    </div>
                </div>

                {/* Date + Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium">Date <span className="text-destructive">*</span></label>
                        <input
                            type="date"
                            value={appointmentDate}
                            min={minDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className={selectClass + ' mt-1'}
                        />
                        <InputError message={errors.appointment_date} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Time <span className="text-destructive">*</span></label>
                        <select
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            disabled={!appointmentDate}
                            className={selectClass + ' mt-1 disabled:opacity-50'}
                        >
                            <option value="">{appointmentDate ? 'Select time...' : 'Pick a date first'}</option>
                            {availableSlots.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {appointmentDate && isFriday(appointmentDate) && (
                            <p className="mt-1 text-xs text-muted-foreground">Friday hours: 3:00 PM – 9:00 PM</p>
                        )}
                        <InputError message={errors.appointment_time} className="mt-1" />
                    </div>
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                    <p className="text-sm font-medium">Contact details</p>
                    <div>
                        <label className="text-sm text-muted-foreground">Name <span className="font-normal">(optional)</span></label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your name"
                            maxLength={100}
                            className={inputClass + ' mt-1'}
                        />
                        <InputError message={errors.customer_name} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Phone number <span className="text-destructive">*</span></label>
                        <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g. 01700-000000"
                            maxLength={20}
                            className={inputClass + ' mt-1'}
                        />
                        <InputError message={errors.customer_phone} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Email address <span className="font-normal">(optional)</span></label>
                        <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="you@example.com"
                            maxLength={150}
                            className={inputClass + ' mt-1'}
                        />
                        <InputError message={errors.customer_email} className="mt-1" />
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="text-sm font-medium">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="E.g. background color, number of people..."
                        rows={2}
                        maxLength={500}
                        className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <InputError message={errors.notes} className="mt-1" />
                </div>

                <div className="rounded-md border bg-blue-50/50 p-3">
                    <p className="text-sm font-medium">Walk-ins are also welcome!</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Business hours: Sat–Thu 9:00 AM – 9:30 PM · Friday 3:00 PM – 9:00 PM. Booking ahead helps us prepare.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                    {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
            </form>
            </div>
        </LandingLayout>
    );
}
