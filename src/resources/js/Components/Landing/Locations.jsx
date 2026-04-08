const locations = [
    {
        badge: 'Studio 1',
        name: 'Shantinagar',
        address: 'Shantinagar Moar, Bailly Road, Dhaka',
        hours: 'Sat–Thu 9:30 AM – 9:00 PM, Fri 3:00 PM – 9:00 PM',
        phone: '01713-140768',
        mapUrl: 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
        gradient: 'from-secondary to-secondary/80',
    },
    {
        badge: 'Studio 2',
        name: 'Gulshan-1',
        address: 'House 5, Road 21, Gulshan-1, Dhaka 1212',
        hours: 'Sat–Thu 9:30 AM – 9:00 PM, Fri 3:00 PM – 9:00 PM',
        phone: '01713-140768',
        mapUrl: 'https://maps.app.goo.gl/uLh3GKExPgmbjY8H8',
        gradient: 'from-primary to-primary/80',
    },
];

export default function Locations() {
    return (
        <section id="locations" className="relative overflow-hidden bg-white dark:bg-gray-900 px-4 py-20 sm:px-6 lg:py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-light to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-1.5 text-sm font-semibold text-secondary border border-border dark:border-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.01a7.76 7.76 0 0 0 .453-.246 14.87 14.87 0 0 0 2.253-1.682c1.962-1.826 4.462-4.909 4.462-9.092 0-4.142-3.358-7.5-7.5-7.5S2.5 5.892 2.5 10c0 4.183 2.5 7.266 4.462 9.092a14.87 14.87 0 0 0 2.253 1.682 7.76 7.76 0 0 0 .462.257l.018.01.006.003.002.001zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                        </svg>
                        Two Locations
                    </span>
                    <h2 className="font-poppins mt-6 text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-5xl">
                        Visit Us Today
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary dark:text-gray-300">
                        Conveniently located in Shantinagar and Gulshan. Both studios offer the same premium services and fast turnaround.
                    </p>
                </div>

                <div className="mt-14 grid gap-8 lg:grid-cols-2">
                    {locations.map((loc) => (
                        <div
                            key={loc.name}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 shadow-sm transition-all hover:border-secondary/30 dark:hover:border-secondary/50 hover:shadow-md"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${loc.gradient}`} />

                            <div className="p-8">
                                <div className="flex items-start justify-between">
                                    <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${loc.gradient} px-3 py-1.5 text-xs font-semibold text-white`}>
                                        {loc.badge}
                                    </span>
                                    <a
                                        href={loc.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-surface dark:bg-gray-700 p-2 text-text-secondary dark:text-gray-300 transition-colors hover:bg-secondary/10 dark:hover:bg-secondary/20 hover:text-secondary"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </a>
                                </div>

                                <h3 className="font-poppins mt-4 text-2xl font-bold text-text-primary dark:text-white">
                                    {loc.name}
                                </h3>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Address</p>
                                            <p className="text-text-primary dark:text-white">{loc.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Hours</p>
                                            <p className="text-text-primary dark:text-white">{loc.hours}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Phone</p>
                                            <a href={`tel:${loc.phone}`} className="font-semibold text-text-primary dark:text-white hover:text-secondary">
                                                {loc.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={loc.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-surface dark:bg-gray-700 py-3 font-medium text-text-primary dark:text-white transition-colors hover:bg-secondary/10 dark:hover:bg-secondary/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                    </svg>
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl bg-gradient-to-r from-secondary/5 to-primary/5 dark:from-secondary/10 dark:to-primary/10 p-8 text-center border border-border dark:border-gray-700">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <svg className="h-8 w-8 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" d="M10.868 2.884c-.321-.752-1.415-.752-1.736 0l-1.83 4.281a1.753 1.753 0 0 1-1.468 1.046l-4.617.64c-.77.107-1.08 1.077-.52 1.635l3.344 3.258c.363.354.529.866.444 1.369l-.79 4.527c-.136.771.678 1.359 1.376 1.007l4.131-2.172a1.753 1.753 0 0 1 1.629 0l4.131 2.172c.698.352 1.512-.236 1.376-1.007l-.79-4.527a1.753 1.753 0 0 1 .444-1.369l3.344-3.258c.56-.558.25-1.528-.52-1.635l-4.617-.64a1.753 1.753 0 0 1-1.468-1.046l-1.83-4.281Z" fillRule="evenodd" />
                        </svg>
                        <div className="text-left">
                            <p className="font-poppins text-lg font-bold text-text-primary dark:text-white sm:text-xl">
                                Rated 5.0 stars by our customers
                            </p>
                            <p className="text-sm text-text-secondary dark:text-gray-300">
                                Join thousands of satisfied customers on Google
                            </p>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-accent hover:shadow-md"
                        >
                            Read Reviews
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}