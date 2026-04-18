import { Link } from '@inertiajs/react';

const stats = [
    { value: '2009', label: 'Year Founded' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '10 min', label: 'Avg Turnaround' },
    { value: '5.0★', label: 'Google Rating' },
];

const features = [
    {
        title: 'Fujifilm Frontier Printing',
        description: 'Professional Fujifilm Frontier-S and DE100 machines produce true-to-life colors on archival photo paper.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
            </svg>
        ),
    },
    {
        title: 'Two Prime Locations',
        description: 'Bailey Road near Shantinagar Moar, and Gulshan-1 — both easily accessible from anywhere in Dhaka.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
    },
    {
        title: 'Godox Professional Lighting',
        description: 'Studio-grade Godox softbox and flash systems ensure perfect exposure and shadow-free portrait lighting.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
        ),
    },
    {
        title: 'Satisfaction Guaranteed',
        description: 'Not happy with your photos? We retake them at no extra charge. That\'s our promise to every customer.',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.157 3.745 3.745 0 01-3.157 1.043A4.501 4.501 0 0112 21a4.5 4.5 0 01-3.207-1.732 3.745 3.745 0 01-3.157-1.043 3.745 3.745 0 01-1.043-3.157A4.5 4.5 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.157 3.745 3.745 0 013.157-1.043A4.5 4.5 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.157 1.043 3.745 3.745 0 011.043 3.157A4.5 4.5 0 0121 12z" />
            </svg>
        ),
    },
];

export default function About() {
    return (
        <section id="about" className="bg-gray-50 px-4 py-20 dark:bg-gray-900 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Image + stats */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src="/images/studio/studio-05.jpg"
                                alt="Focus Digital Color Lab professional Fujifilm Frontier printing machines, Dhaka"
                                className="w-full object-cover h-[420px]"
                                loading="lazy"
                            />
                        </div>

                        {/* Second image inset */}
                        <div className="absolute -bottom-6 -right-4 hidden w-48 overflow-hidden rounded-xl border-4 border-white shadow-xl dark:border-gray-900 sm:block">
                            <img
                                src="/images/studio/studio-03.jpg"
                                alt="FDCL photo studio comfortable reception area"
                                className="h-36 w-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        {/* Experience badge */}
                        <div className="absolute -top-4 -left-4 hidden rounded-2xl bg-primary p-4 shadow-lg sm:block">
                            <div className="text-center text-white">
                                <div className="text-3xl font-extrabold leading-none">15+</div>
                                <div className="mt-0.5 text-xs font-medium opacity-90">Years Serving<br />Dhaka</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="sm:pt-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary dark:bg-primary/20">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.062l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            Trusted Since 2009
                        </span>

                        <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Dhaka's Most Trusted<br />Photo Studio
                        </h2>

                        <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                            For over 15 years, <strong className="text-gray-900 dark:text-white">Focus Digital Color Lab</strong> has been the go-to destination for professional photography services in Dhaka. Our two studios — at <strong className="text-gray-900 dark:text-white">Bailey Road</strong> and <strong className="text-gray-900 dark:text-white">Gulshan</strong> — serve thousands of customers every month.
                        </p>

                        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                            We use <strong className="text-gray-900 dark:text-white">Fujifilm Frontier</strong> professional printing machines and <strong className="text-gray-900 dark:text-white">Godox studio lighting</strong> to deliver advanced quality photo prints that meet the highest international standards — accepted by Schools, embassies, immigration offices, and government agencies worldwide.
                        </p>

                        {/* Stats grid */}
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                                    <div className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Features grid */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/order"
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg cursor-pointer"
                            >
                                Get Started
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <a
                                href="#locations"
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#locations')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Find Our Studios
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
