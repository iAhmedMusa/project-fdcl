import { Link } from '@inertiajs/react';

export default function Contact() {
    return (
        <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-white via-light to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-20 sm:px-6 lg:py-24">
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50" />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-1.5 text-sm font-semibold text-primary border border-border dark:border-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h15a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 1 2.25 3Z" />
                        </svg>
                        Get in Touch
                    </div>

                    <h2 className="font-poppins mt-6 text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-5xl lg:text-6xl">
                        Ready to Order?
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary dark:text-gray-300">
                        Visit one of our studios or order online. Our friendly team is here to help you with all your photography needs.
                    </p>

                    <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
                        <a
                            href="tel:01713140768"
                            className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 px-6 py-4 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Call Us</p>
                                <p className="text-xl font-bold text-text-primary dark:text-white">01713-140768</p>
                            </div>
                        </a>

                        <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 px-6 py-4 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Opening Hours</p>
                                <p className="text-base font-semibold text-text-primary dark:text-white">Sat–Thu 9:30 AM – 9:00 PM</p>
                                <p className="text-sm text-text-secondary dark:text-gray-400">Fri 3:00 PM – 9:00 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link
                            href="/order"
                            className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-md transition-all hover:bg-primary/80 hover:shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h15a.75.75 0 0 1 .75.75v15a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 1 2.25 3Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 7.5ZM9 16.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5H5.25a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75H7.5m0-3v3m0 0h4.5v3m4.5 0v-1.5a.75.75 0 0 0-.75-.75h-3.75v3m-4.5 3h4.5" />
                            </svg>
                            Order Your Photo Now
                        </Link>

                        <p className="mt-4 text-sm text-text-secondary dark:text-gray-400">
                            No account needed to browse. Sign up when you're ready.
                        </p>
                    </div>
                </div>

<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-4 rounded-xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 p-5 shadow-sm">
                        <svg className="h-6 w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.157 3.745 3.745 0 0 1-3.157 1.043A4.501 4.501 0 0 1 12 21a4.5 4.5 0 0 1-3.207-1.732 3.745 3.745 0 0 1-3.157-1.043 3.745 3.745 0 0 1-1.043-3.157A4.5 4.5 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.157 3.745 3.745 0 0 1 3.157-1.043A4.5 4.5 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.157 1.043 3.745 3.745 0 0 1 1.043 3.157A4.5 4.5 0 0 1 21 12Z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-text-primary dark:text-white">100% Satisfaction Guaranteed</p>
                            <p className="text-sm text-text-secondary dark:text-gray-300">We'll retake your photo at no extra cost if you're not satisfied</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 p-5 shadow-sm">
                        <svg className="h-6 w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-text-primary dark:text-white">10-Minute Express Service</p>
                            <p className="text-sm text-text-secondary dark:text-gray-300">Walk in with your requirements, walk out with your photos</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                        <svg className="h-6 w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 3.598 6 11.95 11.95 0 0 1 3 12c0 .924.13 1.82.374 2.669.246.849.61 1.663 1.088 2.425a11.95 11.95 0 0 0 2.425 1.088A11.956 11.956 0 0 0 12 21c.924 0 1.82-.13 2.669-.374a11.95 11.956 11.95 0 0 0 2.425-1.088 11.95 11.95 0 0 0 1.088-2.425A11.956 11.956 0 0 0 21 12c0-.924-.13-1.82-.374-2.669a11.95 11.956 11.95 0 0 0-1.088-2.425 11.95 11.95 0 0 0-2.425-1.088A11.956 11.956 0 0 0 12 3Z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-text-primary dark:text-white">FDCL Photo ID System</p>
                            <p className="text-sm text-text-secondary dark:text-gray-300">Get a unique ID to reorder your photos anytime without visiting</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}