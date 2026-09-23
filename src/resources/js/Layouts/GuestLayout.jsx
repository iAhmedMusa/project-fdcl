import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import useFlash from '@/hooks/useFlash';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    useFlash();
    const { lang, toggleLang } = useLanguage();

    return (
        <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
            {/* Form side */}
            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between px-6 py-4 sm:px-10">
                    <Link href="/" className="flex items-center gap-2.5">
                        <ApplicationLogo className="h-9 w-9 rounded-full" />
                        <span className="text-sm font-bold leading-tight text-foreground">
                            Focus Digital Color Lab
                        </span>
                    </Link>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={toggleLang}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                            {lang === 'en' ? 'বাংলা' : 'EN'}
                        </button>
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                    <div className="w-full max-w-sm">{children}</div>
                </div>

                <p className="px-6 pb-5 text-xs text-muted-foreground sm:px-10">
                    © {new Date().getFullYear()} Focus Digital Color Lab · Bailey Road &amp; Gulshan, Dhaka
                </p>
            </div>

            {/* Brand panel — solid violet over real studio photography */}
            <div className="relative hidden w-[45%] flex-col overflow-hidden bg-violet-950 lg:flex xl:w-2/5">
                <img
                    src="/images/studio/studio-04.jpg"
                    alt="Focus Digital Color Lab studio, Bailey Road, Dhaka"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-violet-950/85" />

                <div className="relative flex flex-1 flex-col justify-end p-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-xs font-medium tracking-wide text-white">Serving Dhaka since 2009</span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
                            Professional photos,
                            <br />
                            Print in 10 minutes.
                        </h1>
                        <p className="text-sm leading-relaxed text-white/70">
                            Passport, Visa, NID, school admission — every official photo accepted on first submission. Two studios in Dhaka.
                        </p>
                    </div>

                    <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            'Track your order status in real time',
                            'Reorder any time with your FDCL Photo ID',
                            'Fujifilm Frontier professional printing',
                            'bKash payment accepted',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-7 inline-flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                        <div className="flex -space-x-1.5">
                            {['R','T','A','S'].map((initial, i) => (
                                <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-violet-950 bg-violet-500 text-[10px] font-bold text-white">
                                    {initial}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-white">50,000+ happy customers</p>
                            <p className="text-[10px] text-white/60">5.0 rating on Google</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
