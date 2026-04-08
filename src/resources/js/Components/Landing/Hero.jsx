import { Link } from '@inertiajs/react';

const heroBadges = [
    { icon: '★', text: '15+ Years Experience' },
    { icon: '◆', text: '2 Prime Locations' },
    { icon: '●', text: '10-Minute Express' },
];

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-light via-white to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(26,26,26,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 dark:bg-secondary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="text-center lg:text-left">
                        <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                            {heroBadges.map((badge, idx) => (
                                <div
                                    key={idx}
                                    className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 border border-border dark:border-gray-700 px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-300 shadow-sm"
                                >
                                    <span className="text-primary">{badge.icon}</span>
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </div>

                        <h1 className="font-poppins mb-6 text-5xl font-bold tracking-tight text-text-primary dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                            <span className="block">Premium</span>
                            <span className="block mt-2">
                                <span className="text-primary">Photo</span>
                                <span className="text-text-primary dark:text-white"> Studio</span>
                            </span>
                        </h1>

                        <p className="mb-8 max-w-2xl text-lg text-text-secondary dark:text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                            Professional passport photos, visa applications, and custom prints.
                            Premium quality in just 10 minutes at our Shantinagar or Gulshan studios.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <Link
                                href="/order"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Order Your Photo
                                </span>
                            </Link>

                            <a
                                href="#services"
                                className="inline-flex items-center justify-center rounded-lg border-2 border-border dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-text-primary dark:text-white transition-all hover:border-secondary hover:bg-surface dark:hover:bg-gray-700"
                            >
                                <span className="flex items-center gap-2">
                                    View Services
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </a>
                        </div>

                        <div className="mt-10 flex flex-col gap-4 text-text-secondary dark:text-gray-300 sm:flex-row sm:justify-center lg:justify-start lg:gap-8">
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:+8801713140768" className="hover:text-secondary transition-colors">
                                    +880 1713-140768
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Sat-Thu 9:30AM-9PM</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative mx-auto max-w-md">
                            <div className="absolute -inset-4 bg-gradient-to-br from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20 blur-3xl" />

                            <div className="relative rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-xl">
                                <div className="absolute top-0 right-0 w-20 h-20">
                                    <div className="absolute top-4 right-4 w-16 h-16 rounded-br-2xl border-r-2 border-t-2 border-primary/20" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-20 h-20">
                                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-tl-2xl border-l-2 border-b-2 border-secondary/20" />
                                </div>

                                <div className="mb-6 text-center">
                                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                                        <svg className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="font-poppins mb-2 text-center text-xl font-bold text-text-primary dark:text-white">
                                    FDCL Photo ID
                                </h3>
                                <code className="mb-4 block text-center font-mono text-2xl font-bold text-primary">
                                    FDCL-4K8X2P
                                </code>
                                <p className="text-center text-sm text-text-secondary dark:text-gray-400">
                                    Your unique code to reorder photos anytime
                                </p>

                                <div className="mt-6 space-y-3">
                                    {[
                                        { icon: '●', label: 'Cinema-quality cameras', color: 'text-primary' },
                                        { icon: '●', label: 'Professional lighting', color: 'text-secondary' },
                                        { icon: '●', label: 'Premium photo paper', color: 'text-primary' },
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-lg border border-border dark:border-gray-700 bg-surface dark:bg-gray-700/50 px-3 py-2 text-sm text-text-secondary dark:text-gray-300">
                                            <span className={feature.color}>{feature.icon}</span>
                                            <span>{feature.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
