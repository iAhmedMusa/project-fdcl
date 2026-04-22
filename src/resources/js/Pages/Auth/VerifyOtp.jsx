import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function VerifyOtp({ phone, expiresAt, status }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(60);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        otp_code: '',
    });

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        const joined = newCode.join('');
        setData('otp_code', joined);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (joined.length === 6) {
            const form = document.getElementById('otp-form');
            setTimeout(() => form?.requestSubmit(), 50);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;

        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pasted[i] || '';
        }
        setCode(newCode);
        setData('otp_code', newCode.join(''));

        const nextEmpty = newCode.findIndex((c) => !c);
        inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

        if (pasted.length === 6) {
            const form = document.getElementById('otp-form');
            setTimeout(() => form?.requestSubmit(), 50);
        }
    };

    const handleResend = (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        post(route('otp.resend'), {
            preserveScroll: true,
            onSuccess: () => setCooldown(60),
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.verify.post'));
    };

    return (
        <GuestLayout>
            <Head title="Verify phone number" />

            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                        Verify your phone number
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We sent a 6-digit code to <span className="font-semibold text-foreground">{phone}</span>
                    </p>
                </div>

                {status && (
                    <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
                        {status}
                    </div>
                )}

                <form id="otp-form" onSubmit={submit} className="space-y-5">
                    <div className="flex justify-center gap-2">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="h-12 w-12 rounded-lg border border-input bg-background text-center text-lg font-semibold text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                        ))}
                    </div>

                    {errors.otp_code && (
                        <p className="text-center text-sm text-destructive">{errors.otp_code}</p>
                    )}

                    <button
                        type="submit"
                        disabled={processing || data.otp_code.length < 6}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                    >
                        {processing ? (
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        {processing ? 'Verifying…' : 'Verify code'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?{' '}
                        {cooldown > 0 ? (
                            <span className="font-medium text-muted-foreground">
                                Resend in {cooldown}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={processing}
                                className="font-semibold text-primary hover:text-primary/80 cursor-pointer"
                            >
                                Resend code
                            </button>
                        )}
                    </p>
                </div>

                <div className="border-t border-border pt-4 text-center">
                    <Link
                        href={route('register')}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Change phone number
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}