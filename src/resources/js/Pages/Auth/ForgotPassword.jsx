import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function IconPhone() {
    return (
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
    );
}

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.otp.send'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter your phone number and we'll send a verification code to reset your password.
                    </p>
                </div>

                {status && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                            Phone number
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <IconPhone />
                            </div>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={data.phone}
                                autoComplete="tel"
                                autoFocus
                                onChange={(e) => setData('phone', e.target.value)}
                                className="block w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                                placeholder="01XXXXXXXXX"
                                required
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                    >
                        {processing ? (
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        {processing ? 'Sending code…' : 'Send verification code'}
                    </button>

                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <Link href={route('login')} className="font-semibold text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}
