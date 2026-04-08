import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4">
                <h2 className="text-lg font-semibold">Verify your email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Please verify your email address by clicking on the link we just emailed to you.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-md bg-green-50 p-2.5 text-sm text-green-700">
                    A new verification link has been sent.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
