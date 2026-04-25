import ThemeToggle from '@/Components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import useFlash from '@/hooks/useFlash';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navLinkKeys = [
    { key: 'services', href: '#services' },
    { key: 'gallery', href: '#gallery' },
    { key: 'about', href: '#about' },
    { key: 'locations', href: '#locations' },
    { key: 'faq', href: '#faq' },
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
    const { t, lang, toggleLang } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-light dark:bg-gray-900">
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
                                    {t.nav.brand}
                                </span>
                                <span className="text-xs font-medium tracking-widest text-primary uppercase">
                                    {t.nav.brandSub}
                                </span>
                            </div>
                        </a>

                        <div className="hidden items-center gap-8 md:flex">
                            {navLinkKeys.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    onClick={(e) => smoothScroll(e, link.href)}
                                    className="relative text-sm font-medium text-text-secondary dark:text-gray-300 transition-colors hover:text-text-primary dark:hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {t.nav[link.key]}
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={toggleLang}
                                className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-bold tracking-wide text-text-secondary dark:text-gray-300 transition-colors hover:border-primary/30 hover:text-primary dark:hover:border-primary/30 dark:hover:text-primary cursor-pointer"
                            >
                                {lang === 'en' ? 'বাংলা' : 'EN'}
                            </button>
                            <ThemeToggle />
                            <Link
                                href="/order"
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/80 hover:shadow-md"
                            >
                                {t.nav.cta}
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
                            {navLinkKeys.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    onClick={(e) => {
                                        smoothScroll(e, link.href);
                                        setMobileOpen(false);
                                    }}
                                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary dark:text-gray-300 transition-colors hover:bg-surface dark:hover:bg-gray-700 hover:text-primary"
                                >
                                    {t.nav[link.key]}
                                </a>
                            ))}
                            <div className="pt-4 flex items-center justify-between">
                                <button
                                    onClick={toggleLang}
                                    className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-bold tracking-wide text-text-secondary dark:text-gray-300 transition-colors hover:border-primary/30 hover:text-primary dark:hover:border-primary/30 dark:hover:text-primary cursor-pointer"
                                >
                                    {lang === 'en' ? 'বাংলা' : 'EN'}
                                </button>
                                <ThemeToggle />
                                <Link
                                    href="/order"
className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-bold text-white shadow-sm"
                                onClick={() => setMobileOpen(false)}
                            >
                                {t.nav.cta}
                            </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main>{children}</main>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className={`fixed right-4 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/20 text-gray-700 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white/40 hover:border-white/25 hover:text-primary dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-primary cursor-pointer ${
                    scrolled ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            </button>

            <footer className="bg-gray-950 border-t border-white/10">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logo.png"
                                    alt="Focus Digital Color Lab Logo"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div>
                                    <span className="block text-base font-bold text-white">
                                        {t.footer.brand}
                                    </span>
                                    <span className="block text-xs font-medium tracking-widest text-primary uppercase">
                                        {t.footer.brandSub}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-md">
                                {t.footer.description}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-4">
                                <a
                                    href="tel:+8801713140768"
                                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    {t.footer.phone}
                                </a>
                                <a
                                    href="https://wa.me/8801973140768"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-green-400 transition-colors hover:text-green-300"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                                {t.footer.servicesTitle}
                            </h3>
                            <ul className="space-y-2.5">
                                {[
                                    { label: t.footer.passportPhoto, href: '/order/photo-studio' },
                                    { label: t.footer.visaPhoto, href: '/order/photo-studio' },
                                    { label: t.footer.photoReprint, href: '/login' },
                                    { label: t.footer.photoAlbum, href: '/album' },
                                    { label: t.footer.photoFrame, href: '/frame' },
                                    { label: t.footer.mugPrint, href: '/mug' },
                                ].map((link) => (
                                    <li key={link.href + link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-400 transition-colors hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Locations */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                                {t.footer.locationsTitle}
                            </h3>
                            <div className="space-y-4 text-sm text-gray-400">
                                <div>
                                    <p className="font-semibold text-white">{t.footer.baileyRoad}</p>
                                    <p className="mt-1">{t.footer.baileyRoadAddr1}</p>
                                    <p>{t.footer.baileyRoadAddr2}</p>
                                    <a
                                        href="https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-block text-xs text-primary hover:text-primary/80"
                                    >
                                        {t.footer.openInMaps}
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t.footer.gulshan}</p>
                                    <p className="mt-1">{t.footer.gulshanAddr1}</p>
                                    <p>{t.footer.gulshanAddr2}</p>
                                    <a
                                        href="https://maps.app.goo.gl/uLh3GKExPgmbjY8H8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-block text-xs text-primary hover:text-primary/80"
                                    >
                                        {t.footer.openInMaps}
                                    </a>
                                </div>
                                <div className="rounded-lg bg-white/5 p-3 text-xs">
                                    <p className="font-medium text-white">{t.footer.openingHours}</p>
                                    <p className="mt-1">{t.footer.satThu}</p>
                                    <p>{t.footer.friday}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} {t.footer.copyright}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
