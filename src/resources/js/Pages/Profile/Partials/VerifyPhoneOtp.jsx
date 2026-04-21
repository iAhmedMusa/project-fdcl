import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function VerifyPhoneOtp({ phone, onSuccess, onClose }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(60);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const inputRefs = useRef([]);

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
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        const joined = newCode.join('');
        if (joined.length === 6) {
            handleVerify(joined);
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

        const nextEmpty = newCode.findIndex((c) => !c);
        inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

        if (pasted.length === 6) {
            handleVerify(newCode.join(''));
        }
    };

    const handleVerify = async (otpCode) => {
        setVerifying(true);
        setError('');

        try {
            const response = await axios.post(route('profile.phone.verify-otp'), {
                otp_code: otpCode,
                phone: phone,
            });

            onSuccess(response.data.phone);
        } catch (err) {
            const msg = err.response?.data?.errors?.otp_code?.[0]
                || err.response?.data?.message
                || 'Verification failed. Please try again.';
            setError(msg);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        try {
            await axios.post(route('profile.phone.send-otp'), { phone });
            setCooldown(60);
            setError('');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            const msg = err.response?.data?.errors?.phone?.[0]
                || err.response?.data?.message
                || 'Failed to resend OTP.';
            setError(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="mx-4 w-full max-w-sm rounded-lg border bg-card p-6" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-foreground">Verify phone number</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We sent a 6-digit code to <span className="font-semibold text-foreground">{phone}</span>
                    </p>
                </div>

                <div className="mt-5 flex justify-center gap-2">
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
                            disabled={verifying}
                            className="h-11 w-11 rounded-lg border border-input bg-background text-center text-base font-semibold text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
                        />
                    ))}
                </div>

                {error && (
                    <p className="mt-3 text-center text-sm text-destructive">{error}</p>
                )}

                <div className="mt-5 text-center">
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
                                disabled={verifying}
                                className="font-semibold text-primary hover:text-primary/80 cursor-pointer disabled:opacity-50"
                            >
                                Resend code
                            </button>
                        )}
                    </p>
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}