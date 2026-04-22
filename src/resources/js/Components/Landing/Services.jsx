import { useState, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import FadeIn from '@/Components/FadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Services() {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const services = [
        {
            title: t.services.photoStudio.title,
            description: t.services.photoStudio.description,
            features: t.services.photoStudio.features,
            bookingLink: '/order/photo-studio',
            ctaLabel: t.services.photoStudio.cta,
            badge: null,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
            ),
        },
        {
            title: t.services.photoReprint.title,
            description: t.services.photoReprint.description,
            features: t.services.photoReprint.features,
            bookingLink: '/login',
            ctaLabel: t.services.photoReprint.cta,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m2.161 2.242a34.348 34.348 0 01-5.828 5.828" />
                </svg>
            ),
        },
        {
            title: t.services.photoAlbum.title,
            description: t.services.photoAlbum.description,
            features: t.services.photoAlbum.features,
            bookingLink: '/album',
            ctaLabel: t.services.photoAlbum.cta,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            ),
        },
        {
            title: t.services.customFrame.title,
            description: t.services.customFrame.description,
            features: t.services.customFrame.features,
            bookingLink: '/frame',
            ctaLabel: t.services.customFrame.cta,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v10.5A2.25 2.25 0 003.75 20.25z" />
                </svg>
            ),
        },
        {
            title: t.services.photoMug.title,
            description: t.services.photoMug.description,
            features: t.services.photoMug.features,
            bookingLink: '/mug',
            ctaLabel: t.services.photoMug.cta,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            ),
        },
        {
            title: t.services.printService.title,
            description: t.services.printService.description,
            features: t.services.printService.features,
            ctaLabel: t.services.printService.cta,
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
                </svg>
            ),
        },
    ];

    const scrollTo = useCallback((index) => {
        const clamped = Math.max(0, Math.min(index, services.length - 1));
        setActiveIndex(clamped);
        const container = scrollRef.current;
        if (!container) return;
        const card = container.children[clamped];
        if (card) {
            container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
        }
    }, [services.length]);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
            if (dist < minDist) { minDist = dist; closest = i; }
        }
        setActiveIndex(closest);
    }, []);

    return (
        <section id="services" className="bg-white px-4 py-20 dark:bg-gray-950 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <FadeIn className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary dark:bg-primary/20">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.752-1.415-.752-1.736 0l-1.83 4.281a1.753 1.753 0 01-1.468 1.046l-4.617.64c-.77.107-1.08 1.077-.52 1.635l3.344 3.258c.363.354.529.866.444 1.369l-.79 4.527c-.136.771.678 1.359 1.376 1.007l4.131-2.172a1.753 1.753 0 011.629 0l4.131 2.172c.698.352 1.512-.236 1.376-1.007l-.79-4.527a1.753 1.753 0 01.444-1.369l3.344-3.258c.56-.558.25-1.528-.52-1.635l-4.617-.64a1.753 1.753 0 01-1.468-1.046l-1.83-4.281z" clipRule="evenodd" />
                        </svg>
                        {t.services.badge}
                    </span>
                    <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        {t.services.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        {t.services.subtitle}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        {t.services.bKashBadge}
                    </div>
                </FadeIn>

                <div className="relative mt-14">
                    <button
                        onClick={() => scrollTo(activeIndex - 1)}
                        className="absolute -left-2 top-1/2 z-10 flex h-10 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/20 text-gray-700 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:bg-white/35 hover:border-white/25 hover:text-primary sm:hidden cursor-pointer dark:border-white/5 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-primary dark:shadow-black/20"
                        aria-label="Previous service"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollTo(activeIndex + 1)}
                        className="absolute -right-2 top-1/2 z-10 flex h-10 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/20 text-gray-700 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:bg-white/35 hover:border-white/25 hover:text-primary sm:hidden cursor-pointer dark:border-white/5 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-primary dark:shadow-black/20"
                        aria-label="Next service"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {services.map((service, index) => (
                            <FadeIn key={service.title} delay={index * 80} className="shrink-0 w-[82vw] snap-start sm:w-auto">
                            <div
                                className="group relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/30 sm:p-7"
                            >
                                {service.badge && (
                                    <div className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                                        {service.badge}
                                    </div>
                                )}

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/15 dark:bg-primary/20">
                                    {service.icon}
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {service.description}
                                </p>

                                <ul className="mt-4 space-y-2">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <svg className="h-4 w-4 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {service.bookingLink && service.ctaLabel && (
                                    <Link
                                        href={service.bookingLink}
                                        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white dark:bg-primary/20 dark:hover:bg-primary cursor-pointer"
                                    >
                                        {service.ctaLabel}
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-center gap-2 sm:hidden">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    index === activeIndex
                                        ? 'w-6 bg-primary'
                                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                                }`}
                                aria-label={`Go to service ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}