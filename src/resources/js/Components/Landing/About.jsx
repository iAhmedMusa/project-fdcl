import { Link } from '@inertiajs/react';

const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '50,000+', label: 'Happy Customers' },
    { value: '10 min', label: 'Average Turnaround' },
    { value: '5.0', label: 'Google Rating' },
];

const features = [
    {
        title: 'Professional Equipment',
        description: 'We use high-end DSLR cameras and professional studio lighting for flawless results.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        ),
    },
    {
        title: 'Two Convenient Locations',
        description: 'Shantinagar and Gulshan studios for easy access from anywhere in Dhaka.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        ),
    },
    {
        title: 'Fast Delivery',
        description: 'Get your passport and visa photos in just 10 minutes. Same-day service for all products.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    {
        title: 'Guaranteed Quality',
        description: 'If you are not satisfied, we will retake your photos at no extra cost. That is our promise.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.157 3.745 3.745 0 0 1-3.157 1.043A4.501 4.501 0 0 1 12 21a4.5 4.5 0 0 1-3.207-1.732 3.745 3.745 0 0 1-3.157-1.043 3.745 3.745 0 0 1-1.043-3.157A4.5 4.5 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.157 3.745 3.745 0 0 1 3.157-1.043A4.5 4.5 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.157 1.043 3.745 3.745 0 0 1 1.043 3.157A4.5 4.5 0 0 1 21 12Z" />
            </svg>
        ),
    },
];

export default function About() {
    return (
        <section id="about" className="relative overflow-hidden bg-surface dark:bg-gray-800 px-4 py-20 sm:px-6 lg:py-24">
            <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 opacity-50 blur-3xl dark:from-secondary/5 dark:to-primary/5" />
            <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50 blur-3xl dark:from-primary/5 dark:to-secondary/5" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.062l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            Trusted Since 2009
                        </span>
                        <h2 className="font-poppins mt-6 text-4xl font-bold tracking-tight text-text-primary dark:text-white sm:text-5xl">
                            Dhaka's Most Trusted Photo Studio
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-text-secondary dark:text-gray-300">
                            For over 15 years, Focus Digital Color Lab has been the go-to destination for professional photography services in Dhaka. We combine precision equipment with professional expertise to deliver flawless results every time.
                        </p>
                        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-gray-300">
                            Whether you need a single passport photo or a bulk corporate order, our experienced team ensures consistent quality with fast turnaround times that our customers have come to rely on.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <Link
                                href="/order"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary/80 hover:shadow-lg"
                            >
                                Get Started Now
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <a
                                href="#locations"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-border dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-text-primary dark:text-white transition-colors hover:border-secondary hover:bg-surface dark:hover:bg-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                Visit Our Studios
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl bg-white dark:bg-gray-800 p-6 text-center shadow-sm border border-border dark:border-gray-700 ${
                                        index === 0 ? 'translate-y-4' : index === 3 ? '-translate-y-4' : ''
                                    }`}
                                >
                                    <div className="font-poppins text-4xl font-extrabold text-primary">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-text-secondary dark:text-gray-300">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="font-poppins text-center text-2xl font-bold text-text-primary dark:text-white sm:text-3xl">
                        Why Choose Us?
                    </h3>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <div key={feature.title} className="group rounded-xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700 p-6 transition-all hover:border-secondary/30 dark:hover:border-secondary/50 hover:shadow-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <h4 className="mt-4 font-semibold text-text-primary dark:text-white">
                                    {feature.title}
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}