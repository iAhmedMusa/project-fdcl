import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useFlash from '@/hooks/useFlash';
import ThemeToggle from '@/Components/ThemeToggle';

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
        mobileIcon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
    },
    {
        name: 'New Order',
        href: '/order',
        highlight: true,
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        ),
        mobileIcon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        ),
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        ),
        mobileIcon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        ),
        warnOnNoPhone: true,
    },
];

export default function CustomerLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    useFlash();

    const currentPath = window.location.pathname;

    function isActive(item) {
        if (item.href === '/order') return currentPath === '/order';
        if (item.href === '/dashboard') return currentPath.startsWith('/dashboard');
        return currentPath.startsWith(item.href);
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar */}
            <aside className={`hidden flex-col border-r bg-card sticky top-0 h-screen overflow-y-auto transition-all duration-300 lg:flex ${collapsed ? 'w-16' : 'w-64'}`}>
                {/* Logo & Brand */}
                <div className={`flex h-16 items-center border-b ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm font-bold tracking-tight">Focus Digital</span>
                            <span className="text-[10px] text-muted-foreground">COLOR LAB</span>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                            title="Collapse sidebar"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    )}
                </div>

                {collapsed && (
                    <div className="flex justify-center border-b py-2">
                        <button
                            onClick={() => setCollapsed(false)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                            title="Expand sidebar"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navigation.map((item) => {
                        const active = isActive(item);
                        const showWarn = item.warnOnNoPhone && !user.phone;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                                    collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                                } ${
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : item.highlight
                                        ? 'text-primary hover:bg-primary/10'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <span className="relative">
                                    {item.icon}
                                    {showWarn && !active && (
                                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-500" />
                                    )}
                                </span>
                                {!collapsed && item.name}
                                {!collapsed && showWarn && !active && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-yellow-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="border-t p-3">
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" title={user.name}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <ThemeToggle />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Sign out"
                                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <ThemeToggle />
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    Sign out
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile header — app-like, minimal */}
                <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="FDCL" className="h-8 w-8 rounded-full" />
                        <span className="text-sm font-bold">Focus Digital Color Lab</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            title="Sign out"
                            onClick={(e) => { e.preventDefault(); setShowLogoutModal(true); }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    </div>
                </header>

                {/* Mobile logout confirmation modal */}
                {showLogoutModal && (
                    <>
                        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowLogoutModal(false)} />
                        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t bg-card p-6 shadow-xl lg:hidden">
                            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />
                            <div className="mb-1 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                    <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-semibold">Sign out?</h3>
                                <p className="mt-1 text-sm text-muted-foreground">You'll need to log in again to access your account.</p>
                            </div>
                            <div className="mt-5 flex flex-col gap-2">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full rounded-lg bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Sign out
                                </Link>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full rounded-lg border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Mobile bottom tab bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <div className="flex items-center justify-around">
                        {navigation.map((item) => {
                            const active = isActive(item);
                            const showWarn = item.warnOnNoPhone && !user.phone;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-2 pt-1.5 pb-2 text-[10px] font-medium transition-colors ${
                                        active
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span className="relative">
                                        {item.mobileIcon}
                                        {showWarn && !active && (
                                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-500" />
                                        )}
                                    </span>
                                    <span>{item.name}</span>
                                    {active && (
                                        <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}