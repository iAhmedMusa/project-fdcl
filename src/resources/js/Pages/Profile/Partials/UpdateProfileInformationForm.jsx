import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import VerifyPhoneOtp from './VerifyPhoneOtp';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const parseAddress = (addr) => {
        if (!addr) return { flat: '', road: '', block: '', postalCode: '' };
        const parts = addr.split(', ').filter(p => p !== 'Dhaka');
        return {
            flat: parts[0] || '',
            road: parts[1] || '',
            block: parts[2] || '',
            postalCode: parts[3] || '',
        };
    };

    const parsed = parseAddress(user.address);
    const [flat, setFlat] = useState(parsed.flat);
    const [road, setRoad] = useState(parsed.road);
    const [block, setBlock] = useState(parsed.block);
    const [postalCode, setPostalCode] = useState(parsed.postalCode);

    const buildAddress = (f, r, b, p) =>
        [f, r, b, 'Dhaka', p].filter(Boolean).join(', ');

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
        });

    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpPhone, setOtpPhone] = useState('');

    const phoneIsEmpty = !user.phone;
    const phoneIsChanged = data.phone !== (user.phone || '');

    const handleSendOtp = async () => {
        if (!data.phone || data.phone === user.phone) return;

        setSendingOtp(true);
        setOtpError('');

        try {
            await axios.post(route('profile.phone.send-otp'), {
                phone: data.phone,
            });
            setOtpPhone(data.phone);
            setShowOtpModal(true);
        } catch (err) {
            const msg = err.response?.data?.errors?.phone?.[0]
                || err.response?.data?.message
                || 'Failed to send OTP.';
            setOtpError(msg);
        } finally {
            setSendingOtp(false);
        }
    };

    const handleOtpSuccess = (verifiedPhone) => {
        setShowOtpModal(false);
        setData('phone', verifiedPhone);
        window.location.reload();
    };

    const submit = (e) => {
        e.preventDefault();
        if (phoneIsChanged) return;
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-semibold">Profile Information</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Update your account's profile information and email address.
                </p>
            </header>

            {phoneIsEmpty && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-yellow-500/30 bg-yellow-50 px-4 py-3 dark:bg-yellow-950/40">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Add your phone number</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">A verified phone number is required to place and track orders.</p>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-1" message={errors.email} />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number" />
                        <div className="mt-1 flex gap-2">
                            <TextInput
                                id="phone"
                                type="tel"
                                className="flex-1"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value.replace(/[^\d+]/g, ''))}
                                placeholder="01XXXXXXXXX"
                                autoComplete="tel"
                                inputMode="numeric"
                            />
                            {phoneIsChanged && data.phone && (
                                <PrimaryButton
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp}
                                    className="shrink-0"
                                >
                                    {sendingOtp ? (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : 'Verify'}
                                </PrimaryButton>
                            )}
                        </div>
                        {otpError && <InputError className="mt-1" message={otpError} />}
                        {phoneIsChanged && data.phone && (
                            <p className="mt-1 text-xs text-muted-foreground">Save other changes first. Phone changes require OTP verification.</p>
                        )}
                        {!phoneIsChanged && !phoneIsEmpty && (
                            <InputError className="mt-1" message={errors.phone} />
                        )}
                    </div>
                    <div className="space-y-2">
                        <InputLabel value="Delivery Address" />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <TextInput
                                    className="w-full"
                                    value={flat}
                                    onChange={(e) => { setFlat(e.target.value); setData('address', buildAddress(e.target.value, road, block, postalCode)); }}
                                    placeholder="Flat / Apt No."
                                />
                            </div>
                            <div>
                                <TextInput
                                    className="w-full"
                                    value={road}
                                    onChange={(e) => { setRoad(e.target.value); setData('address', buildAddress(flat, e.target.value, block, postalCode)); }}
                                    placeholder="Road / Street"
                                />
                            </div>
                            <div>
                                <TextInput
                                    className="w-full"
                                    value={block}
                                    onChange={(e) => { setBlock(e.target.value); setData('address', buildAddress(flat, road, e.target.value, postalCode)); }}
                                    placeholder="Block / Area"
                                />
                            </div>
                            <div>
                                <TextInput
                                    className="w-full"
                                    value={postalCode}
                                    onChange={(e) => { setPostalCode(e.target.value); setData('address', buildAddress(flat, road, block, e.target.value)); }}
                                    placeholder="Postal Code"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">City: Dhaka</p>
                        <InputError className="mt-1" message={errors.address} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-sm text-primary underline hover:text-primary/80"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-1 text-sm font-medium text-green-600">
                                A new verification link has been sent.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                    <PrimaryButton disabled={processing || phoneIsChanged}>Save changes</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">Saved.</p>
                    </Transition>
                </div>
            </form>

            {showOtpModal && (
                <VerifyPhoneOtp
                    phone={otpPhone}
                    onSuccess={handleOtpSuccess}
                    onClose={() => setShowOtpModal(false)}
                />
            )}
        </section>
    );
}