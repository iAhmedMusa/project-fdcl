import ThemeToggle from '@/Components/ThemeToggle';
import useFlash from '@/hooks/useFlash';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Locations', href: '#locations' },
    { label: 'Contact', href: '#contact' },
];

function smoothScroll(e, href) {
    if (href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function LandingLayout({ children }) {
    useFlash();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="font-inter min-h-screen bg-light dark:bg-gray-900">
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm'
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <a href="/" className="flex items-center gap-3 shrink-0">
                            <img
                                src="/images/logo.png"
                                alt="FDCL Logo"
                                className="h-12 w-12 rounded-full"
                            />
                            <div className="flex flex-col">
                                <span className="font-poppins text-lg font-bold leading-tight text-text-primary dark:text-white">
                                    Focus Digital Color Lab
                                </span>
                                <span className="text-xs font-medium tracking-widest text-primary uppercase">
                                    Premium Photo Studio
                                </span>
                            </div>
                        </a>

                        <div className="hidden items-center gap-8 md:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => smoothScroll(e, link.href)}
                                    className="relative text-sm font-medium text-text-secondary dark:text-gray-300 transition-colors hover:text-text-primary dark:hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                href="/order"
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/80 hover:shadow-md"
                            >
                                Order Now
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary dark:text-gray-300 transition-colors hover:bg-surface dark:hover:bg-gray-700 md:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t border-border dark:border-gray-700 bg-white dark:bg-gray-800 md:hidden">
                        <div className="space-y-1 px-4 py-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => {
                                        smoothScroll(e, link.href);
                                        setMobileOpen(false);
                                    }}
                                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary dark:text-gray-300 transition-colors hover:bg-surface dark:hover:bg-gray-700 hover:text-primary"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-4 flex items-center justify-between">
                                <ThemeToggle />
                                <Link
                                    href="/order"
                                    className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-bold text-white shadow-sm"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main>{children}</main>

            <footer className="bg-white dark:bg-gray-800 border-t border-border dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logo.png"
                                    alt="FDCL Logo"
                                    className="h-10 w-10 rounded-full"
                                />
                                <span className="font-poppins text-lg font-bold text-text-primary dark:text-white">
                                    Focus Digital Color Lab
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-gray-400 max-w-md">
                                The Best Premium studio in Dhaka. Professional photography, Passport Size, All countries Visa photo sizes, custom prints — ready in 10 minutes.
                            </p>
                            <div className="mt-6 flex gap-6">
                                <a
                                    href="tel:01713140768"
                                    className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 transition-colors hover:text-primary"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    01713-140768
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                                Quick Links
                            </h3>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    { label: 'Services', href: '#services' },
                                    { label: 'About', href: '#about' },
                                    { label: 'Locations', href: '#locations' },
                                    { label: 'Contact', href: '#contact' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => smoothScroll(e, link.href)}
                                            className="text-sm text-text-secondary dark:text-gray-400 transition-colors hover:text-text-primary dark:hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                                Locations
                            </h3>
                            <div className="mt-4 space-y-3 text-sm text-text-secondary dark:text-gray-400">
                                <p className="font-medium text-text-primary dark:text-white">Bailey Road</p>
                                <p>Shantinagar Moar, Bailey Road, Dhaka 1217</p>
                                <p className="font-medium text-text-primary dark:text-white mt-4">Gulshan</p>
                                <p>House 5, Road 21, Dhaka 1212</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border dark:border-gray-700">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-center text-xs text-text-muted dark:text-gray-500">
                            © {new Date().getFullYear()} Focus Digital Color Lab. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
