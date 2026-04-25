import { useLanguage } from '@/contexts/LanguageContext';

export default function Locations() {
    const { t } = useLanguage();

    const locations = [
        {
            badge: t.locations.studio1Badge,
            name: t.locations.studio1Name,
            subtitle: t.locations.studio1Subtitle,
            address: t.locations.studio1Address,
            landmarks: t.locations.studio1Landmarks,
            hours: t.locations.studio1Hours,
            phone: '01713-140768',
            mapUrl: 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
            photo: '/images/studio/studio-04.jpg',
            photoAlt: 'Focus Digital Color Lab Bailey Road studio exterior, Dhaka',
            status: t.locations.studio1Status,
            statusKey: 'open',
        },
        {
            badge: t.locations.studio2Badge,
            name: t.locations.studio2Name,
            subtitle: t.locations.studio2Subtitle,
            address: t.locations.studio2Address,
            landmarks: t.locations.studio2Landmarks,
            hours: t.locations.studio2Hours,
            phone: '01713-140768',
            mapUrl: 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
            photo: '/images/studio/studio-22.jpg',
            photoAlt: 'Focus Digital Color Lab Gulshan studio exterior, Dhaka',
            status: t.locations.studio2Status,
            statusKey: 'open',
        },
        {
            badge: t.locations.studio3Badge,
            name: t.locations.studio3Name,
            subtitle: t.locations.studio3Subtitle,
            address: t.locations.studio3Address,
            landmarks: t.locations.studio3Landmarks,
            hours: t.locations.studio3Hours,
            phone: '01713-140768',
            mapUrl: 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
            photo: null,
            photoAlt: '',
            status: t.locations.studio3Status,
            statusKey: 'soon',
        },
    ];

    return (
        <section id="locations" className="bg-white px-4 py-20 dark:bg-gray-950 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.01a7.76 7.76 0 00.453-.246 14.87 14.87 0 002.253-1.682C14.96 15.226 17.5 12.073 17.5 8c0-4.142-3.358-7.5-7.5-7.5S2.5 3.858 2.5 8c0 4.073 2.54 7.226 4.46 9.092a14.87 14.87 0 002.253 1.682 7.76 7.76 0 00.462.257l.018.01.006.003.002.001zM10 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {t.locations.badge}
                    </span>
                    <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        {t.locations.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        {t.locations.subtitle}
                    </p>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                    {locations.map((loc) => (
                        <div
                            key={loc.name}
                            className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                                loc.statusKey === 'soon'
                                    ? 'border-dashed border-gray-200 dark:border-gray-700'
                                    : 'border-gray-100 dark:border-gray-700'
                            } bg-white dark:bg-gray-800`}
                        >
                            {loc.photo ? (
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={loc.photo}
                                        alt={loc.photoAlt}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                                            {loc.badge}
                                        </span>
                                        {loc.statusKey === 'open' && (
                                            <span className="flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                {loc.status}
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={loc.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-gray-700 shadow transition-colors hover:bg-white cursor-pointer"
                                        aria-label="Open in Google Maps"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </a>
                                </div>
                            ) : (
                                <div className="relative flex h-44 items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                    <div className="text-center">
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            {loc.badge}
                                        </span>
                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t.locations.studio3Placeholder}</p>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {loc.name}
                                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        — {loc.subtitle}
                                    </span>
                                </h3>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-start gap-2.5">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{loc.address}</p>
                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{loc.landmarks}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{loc.hours}</p>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        <a
                                            href={`tel:${loc.phone}`}
                                            className="text-sm font-semibold text-gray-900 transition-colors hover:text-primary dark:text-white cursor-pointer"
                                        >
                                            {loc.phone}
                                        </a>
                                    </div>
                                </div>

                                {loc.statusKey !== 'soon' && (
                                    <a
                                        href={loc.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-primary/10 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                        </svg>
                                        {t.locations.openInMaps}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary/5 via-white to-primary/5 p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 dark:from-primary/10 dark:via-gray-800 dark:to-primary/10">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} className="h-6 w-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{t.locations.ratingText}</span>
                    </div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {t.locations.ratingSubtext}
                    </p>
                    <a
                        href="https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg cursor-pointer"
                    >
                        {t.locations.readReviews}
                    </a>
                </div>
            </div>
        </section>
    );
}