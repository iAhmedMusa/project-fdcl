const services = [
    {
        title: 'Photo Studio',
        description: 'Professional photography for passport, visa, NID, driving license, and all official documents.',
        features: ['10-minute express service', 'High-end DSLR cameras', 'Professional studio lighting', 'Instant digital & print delivery'],
        bookingLink: '/order/photo-studio',
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        ),
    },
    {
        title: 'Photo Reprint',
        description: 'Reorder your photos anytime using your unique FDCL Photo ID. No need to visit the studio again.',
        features: ['Use FDCL Photo ID', 'Upload from device, or Cloud Drive', 'Visa & passport sizes', 'Instant digital & print delivery'],
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m2.161 2.242a34.348 34.348 0 0 1-5.828 5.828l-.002.002-.002-.002a8.25 8.25 0 0 1-2.16-2.161m5.992 5.992a8.25 8.25 0 0 0-5.828 5.828" />
            </svg>
        ),
    },
    {
        title: 'Photo Album',
        description: 'Transform your cherished memories into beautifully crafted photo albums that last a lifetime.',
        features: ['Wedding albums', 'Travel memories', 'Custom layouts & designs', 'Premium binding & paper'],
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
    {
        title: 'Photo Frame',
        description: 'Custom-framed prints perfect for homes, offices, and gifts. Professional mounting included.',
        features: ['Multiple sizes available', 'Wall mounting service', 'Premium frame materials', 'Custom matting options'],
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 6 20.25h12" />
            </svg>
        ),
    },
    {
        title: 'Mug Print',
        description: 'Personalized photo mugs for gifts, corporate branding, or promotional items.',
        features: ['Single or bulk orders', 'Corporate packages', 'Full-color printing', 'Durable ceramic mugs'],
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        ),
    },
    {
        title: 'Photo Print',
        description: 'Print photos from your phone, USB drive, or cloud storage. Any size, any quantity.',
        features: ['Phone, Portable Drive, or Cloud Drive', 'Standard & custom sizes', 'Glossy or matte finish', 'Instant printing'],
        icon: (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-3 0h.008v.008h-.008V12Z" />
            </svg>
        ),
    },
];

import { Link } from '@inertiajs/react';

export default function Services() {
    return (
        <section id="services" className="relative overflow-hidden bg-white dark:bg-gray-900 px-4 py-20 sm:px-6 lg:py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-light to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.752-1.415-.752-1.736 0l-1.83 4.281a1.753 1.753 0 0 1-1.468 1.046l-4.617.64c-.77.107-1.08 1.077-.52 1.635l3.344 3.258c.363.354.529.866.444 1.369l-.79 4.527c-.136.771.678 1.359 1.376 1.007l4.131-2.172a1.753 1.753 0 0 1 1.629 0l4.131 2.172c.698.352 1.512-.236 1.376-1.007l-.79-4.527a1.753 1.753 0 0 1 .444-1.369l3.344-3.258c.56-.558.25-1.528-.52-1.635l-4.617-.64a1.753 1.753 0 0 1-1.468-1.046l-1.83-4.281Z" clipRule="evenodd" />
                        </svg>
                        Premium Services
                    </span>
                    <h2 className="font-poppins mt-6 text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-5xl">
                        Everything You Need
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary dark:text-gray-300">
                        From instant passport photos to custom photo albums, we deliver quality products with fast turnaround times.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group relative rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-border dark:border-gray-700 transition-all duration-300 hover:border-secondary/30 dark:hover:border-secondary/50 hover:shadow-md sm:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm group-hover:bg-primary/20">
                                    {service.icon}
                                </div>
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                            </div>

                            <h3 className="font-poppins mt-5 text-xl font-bold text-text-primary dark:text-white">
                                {service.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-gray-300">
                                {service.description}
                            </p>

                            <ul className="mt-5 space-y-2">
                                {service.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-300">
                                        <svg className="h-4 w-4 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            {service.bookingLink && (
                                <Link
                                    href={service.bookingLink}
                                    className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                                >
                                    Book Appointment
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}