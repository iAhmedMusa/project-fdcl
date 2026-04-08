import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useFlash from '@/hooks/useFlash';
import ThemeToggle from '@/Components/ThemeToggle';

export default function StaffLayout({ children }) {
    const { auth } = usePage().props;
    useFlash();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const navigation = [
        {
            name: 'Orders',
            href: '/staff',
            isActive: (path) => path === '/staff' || (path.startsWith('/staff/orders/') && path !== '/staff/orders/create'),
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                </svg>
            ),
        },
        {
            name: 'New Order',
            href: '/staff/orders/create',
            isActive: (path) => path === '/staff/orders/create',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            ),
        },
        {
            name: 'Customers',
            href: '/staff/customers',
            isActive: (path) => path.startsWith('/staff/customers') && path !== '/staff/customers/search',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            ),
        },
        {
            name: 'Appointments',
            href: '/staff/appointments',
            isActive: (path) => path.startsWith('/staff/appointments'),
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            ),
        },
        {
            name: 'Photo Storage',
            href: '/staff/photos',
            isActive: (path) => path.startsWith('/staff/photos'),
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            ),
        },
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 border-r bg-card">
                        <div className="flex h-16 items-center justify-between border-b px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 3.598 6 11.95 11.95 0 0 1 3 12c0 .924.13 1.82.374 2.669.246.849.61 1.663 1.088 2.425a11.95 11.95 0 0 0 2.425 1.088A11.956 11.956 0 0 0 12 21c.924 0 1.82-.13 2.669-.374a11.95 11.956 11.95 0 0 0 2.425-1.088 11.95 11.95 0 0 0 1.088-2.425A11.956 11.956 0 0 0 21 12c0-.924-.13-1.82-.374-2.669a11.956 11.956 11.95 0 0 0-1.088-2.425 11.95 11.95 0 0 0-2.425-1.088A11.956 11.956 0 0 0 12 3Z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">Staff Portal</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1 px-3 py-4">
                            {navigation.map((item) => {
                                const active = item.isActive(currentPath);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="border-t p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{auth.user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">Staff Member</p>
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
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className={`hidden flex-col border-r bg-card lg:flex sticky top-0 h-screen overflow-y-auto transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
                <div className={`flex h-16 items-center border-b ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 3.598 6 11.95 11.95 0 0 1 3 12c0 .924.13 1.82.374 2.669.246.849.61 1.663 1.088 2.425a11.95 11.95 0 0 0 2.425 1.088A11.956 11.956 0 0 0 12 21c.924 0 1.82-.13 2.669-.374a11.95 11.956 11.95 0 0 0 2.425-1.088 11.95 11.95 0 0 0 1.088-2.425A11.956 11.956 0 0 0 21 12c0-.924-.13-1.82-.374-2.669a11.956 11.956 11.95 0 0 0-1.088-2.425 11.95 11.95 0 0 0-2.425-1.088A11.956 11.956 0 0 0 12 3Z" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm font-bold">FDCL</span>
                            <span className="text-[10px] text-muted-foreground">Staff Portal</span>
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
                    <div className="flex justify-center py-2 border-b">
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

                <nav className={`flex-1 space-y-1 px-2 py-4`}>
                    {navigation.map((item) => {
                        const active = item.isActive(currentPath);
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
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                {item.icon}
                                {!collapsed && item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-3">
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" title={auth.user.name}>
                                {auth.user.name.charAt(0).toUpperCase()}
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
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{auth.user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">Staff Member</p>
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

            {/* Main */}
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <a
                            href="tel:01713140768"
                            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                            01713-140768
                        </a>
                        <div className="lg:hidden">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}