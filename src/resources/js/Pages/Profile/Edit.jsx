import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const tabs = [
    { id: 'profile', label: 'Profile', icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    )},
    { id: 'password', label: 'Security', icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    )},
    { id: 'danger', label: 'Account', icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    )},
];

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <CustomerLayout>
            <Head title="Profile" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your profile information and account preferences.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 space-y-4">
                        {/* User Card */}
                        <div className="rounded-lg border bg-card">
                            <div className="p-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="rounded-lg border bg-card p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-primary-foreground'
                                            : tab.id === 'danger'
                                            ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="rounded-lg border bg-card">
                                <div className="border-b p-4">
                                    <h2 className="text-base font-semibold">Profile Information</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Update your account profile information and email address.
                                    </p>
                                </div>
                                <div className="p-4">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="rounded-lg border bg-card">
                                <div className="border-b p-4">
                                    <h2 className="text-base font-semibold">Password & Security</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Ensure your account is using a long, random password to stay secure.
                                    </p>
                                </div>
                                <div className="p-4">
                                    <UpdatePasswordForm />
                                </div>
                            </div>
                        )}

                        {activeTab === 'danger' && (
                            <div className="rounded-lg border border-destructive/20 bg-card">
                                <div className="border-b border-destructive/20 p-4">
                                    <h2 className="text-base font-semibold">Delete Account</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all associated data.
                                    </p>
                                </div>
                                <div className="p-4">
                                    <DeleteUserForm />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}