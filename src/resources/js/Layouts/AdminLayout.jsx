import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useFlash from '@/hooks/useFlash';
import ThemeToggle from '@/Components/ThemeToggle';

const NAV_ITEMS = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
        ),
    },
    {
        name: 'Orders',
        href: '/admin/orders',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
        ),
    },
    {
        name: 'Products',
        href: '/admin/products',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
    },
    {
        name: 'Studio Fees',
        href: '/admin/studio-fees',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        ),
    },
    {
        name: 'Users',
        href: '/admin/users',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
        ),
    },
    {
        name: 'Reports',
        href: '/admin/reports',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        ),
    },
];

function UserAvatar({ name, size = 'md' }) {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
    return (
        <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground ring-2 ring-primary/20 ${sz}`}>
            {initials}
        </div>
    );
}

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    useFlash();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const currentPath = window.location.pathname;
    const isActive = (href) => href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(href);

    const logoMark = (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        </div>
    );

    const NavLink = ({ item, compact = false }) => {
        const active = isActive(item.href);
        return (
            <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={compact ? item.name : undefined}
                className={`group flex items-center rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    compact ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                } ${
                    active
                        ? 'border-l-2 border-primary bg-primary/10 text-primary'
                        : 'border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
                <span className={`shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {item.icon}
                </span>
                {!compact && <span>{item.name}</span>}
            </Link>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r bg-card shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b px-4">
                            <div className="flex items-center gap-3">
                                {logoMark}
                                <div>
                                    <p className="text-sm font-bold leading-none tracking-tight">FDCL</p>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground">Admin Panel</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 space-y-0.5 px-3 py-4">
                            {NAV_ITEMS.map(item => <NavLink key={item.name} item={item} />)}
                        </nav>
                        <div className="border-t p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <UserAvatar name={auth.user.name} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{auth.user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">Administrator</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <ThemeToggle />
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className={`hidden flex-col border-r bg-card lg:flex sticky top-0 h-screen overflow-y-auto transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
                {/* Logo */}
                <div className={`flex h-16 shrink-0 items-center border-b ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}`}>
                    {logoMark}
                    {!collapsed && (
                        <>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold leading-none tracking-tight">FDCL</p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">Admin Panel</p>
                            </div>
                            <button
                                onClick={() => setCollapsed(true)}
                                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Collapse sidebar"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                        </>
                    )}
                    {collapsed && (
                        <button
                            onClick={() => setCollapsed(false)}
                            className="absolute right-0 translate-x-full cursor-pointer rounded-r-lg border-y border-r bg-card p-1 text-muted-foreground shadow-sm transition-colors hover:bg-muted"
                            title="Expand sidebar"
                        >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-0.5 px-2 py-4">
                    {NAV_ITEMS.map(item => <NavLink key={item.name} item={item} compact={collapsed} />)}
                </nav>

                {/* User footer */}
                <div className="border-t p-3">
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <UserAvatar name={auth.user.name} size="sm" />
                            <ThemeToggle />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Sign out"
                                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-muted/40 p-3">
                            <div className="flex items-center gap-3">
                                <UserAvatar name={auth.user.name} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{auth.user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">Administrator</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <ThemeToggle />
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="hidden items-center gap-2 lg:flex">
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
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
