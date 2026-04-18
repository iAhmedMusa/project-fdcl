import { Link } from '@inertiajs/react';

const stats = [
    { value: '15+', label: 'Years in Dhaka' },
    { value: '50K+', label: 'Customers' },
    { value: '10 min', label: 'Express' },
    { value: '5.0★', label: 'Google' },
];

const highlights = [
    {
        title: 'School Admission Photos',
        sub: 'Elementary · SSC · ID Card',
        icon: (
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        green: false,
    },
    {
        title: 'Kids Photo Session',
        sub: 'Extra care · Patient team',
        icon: (
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        green: false,
    },
    {
        title: 'Official Document Photo',
        sub: 'Stamp size · Driving License · Job',
        icon: (
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
        ),
        green: false,
    },
    {
        title: 'bKash Accepted',
        sub: 'Pay in-studio via bKash',
        icon: (
            <svg className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
        green: true,
    },
];

export default function Hero() {
    return (
        <section aria-label="Hero" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20">
            {/* Grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(262,83%,58%) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }}
            />
            <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20" />

            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">

                    {/* ── Text — always first in DOM → first on mobile ── */}
                    <div>
                        {/* Location badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary dark:border-primary/30 dark:bg-primary/10 sm:px-4 sm:py-1.5 sm:text-sm">
                            <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.01a7.76 7.76 0 00.453-.246 14.87 14.87 0 002.253-1.682C14.96 15.226 17.5 12.073 17.5 8c0-4.142-3.358-7.5-7.5-7.5S2.5 3.858 2.5 8c0 4.073 2.54 7.226 4.46 9.092a14.87 14.87 0 002.253 1.682 7.76 7.76 0 00.462.257l.018.01.006.003.002.001zM10 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Gulshan &amp; Bailey Road, Dhaka
                        </div>

                        <h1 className="mb-4 font-bold tracking-tight text-gray-900 dark:text-white sm:mb-6">
                            <span className="block text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl xl:text-7xl">
                                Premium
                            </span>
                            <span className="block text-4xl leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                                Photo Studio
                            </span>
                        </h1>

                        <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-lg lg:text-xl">
                            Professional passport &amp; visa application photos accepted worldwide. Fujifilm Frontier printing, Godox studio lighting — ready in <strong className="text-gray-900 dark:text-white">10 minutes</strong>. Trusted by <strong className="text-gray-900 dark:text-white">50,000+ customers</strong> since 2009.
                        </p>

                        {/* CTAs — stack on mobile, row on sm+ */}
                        <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:flex-wrap">
                            <Link
                                href="/order/photo-studio"
                                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5 cursor-pointer sm:inline-flex sm:w-auto"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                </svg>
                                Book Appointment
                            </Link>

                            <div className="grid grid-cols-2 gap-3 sm:contents">
                                <a
                                    href="https://wa.me/8801973140768"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400 cursor-pointer sm:text-base sm:px-7"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </a>
                                <a
                                    href="#services"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary/10 cursor-pointer sm:text-base sm:px-7"
                                    onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
                                >
                                    View Services
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Trust row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 sm:gap-4 sm:text-sm">
                            <div className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>5.0 Google Rating</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">·</span>
                            <div className="flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.157 3.745 3.745 0 01-3.157 1.043A4.501 4.501 0 0112 21a4.5 4.5 0 01-3.207-1.732 3.745 3.745 0 01-3.157-1.043 3.745 3.745 0 01-1.043-3.157A4.5 4.5 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.157 3.745 3.745 0 013.157-1.043A4.5 4.5 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.157 1.043 3.745 3.745 0 011.043 3.157A4.5 4.5 0 0121 12z" />
                                </svg>
                                <span>Satisfaction Guaranteed</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">·</span>
                            <a href="tel:+8801713140768" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                +880 1713-140768
                            </a>
                        </div>
                    </div>

                    {/* ── Photos — second on mobile, right col on desktop ── */}
                    <div>
                        {/* Main photo */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="/images/studio/studio-11.jpg"
                                alt="Focus Digital Color Lab — professional photo studio interior in Dhaka"
                                className="h-[220px] w-full object-cover sm:h-[340px] lg:h-[400px]"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 sm:bottom-4 sm:left-4 sm:px-4 sm:py-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                    <span className="text-xs font-semibold text-gray-800 dark:text-white sm:text-sm">Open Now — 2 Locations</span>
                                </div>
                            </div>
                        </div>

                        {/* Two smaller photos — hidden on mobile to keep hero lean */}
                        <div className="mt-3 hidden grid-cols-2 gap-3 sm:grid">
                            <div className="overflow-hidden rounded-xl shadow-md">
                                <img
                                    src="/images/studio/studio-02.jpg"
                                    alt="Professional Godox studio lighting setup at FDCL photo studio"
                                    className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl shadow-md">
                                <img
                                    src="/images/studio/studio-01.jpg"
                                    alt="Fujifilm Frontier professional photo printing machine at FDCL"
                                    className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Specialty highlights */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {highlights.map((h) => (
                                <div
                                    key={h.title}
                                    className={`flex items-start gap-2 rounded-xl px-3 py-2.5 shadow-sm ${
                                        h.green
                                            ? 'border border-green-100 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10'
                                            : 'border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'
                                    }`}
                                >
                                    <span className="mt-0.5">{h.icon}</span>
                                    <div>
                                        <p className={`text-xs font-semibold leading-tight ${h.green ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                                            {h.title}
                                        </p>
                                        <p className={`mt-0.5 text-xs leading-tight ${h.green ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {h.sub}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats — 2×2 on mobile, 4-col on sm+ */}
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                            {stats.map((s) => (
                                <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-2.5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-3">
                                    <div className="text-base font-extrabold text-primary sm:text-lg">{s.value}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
