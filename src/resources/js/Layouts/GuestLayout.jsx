import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import useFlash from '@/hooks/useFlash';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    useFlash();

    return (
        <div className="flex min-h-screen">
            {/* Left brand panel */}
            <div className="relative hidden lg:flex lg:w-[45%] xl:w-2/5 flex-col overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-950 to-gray-950" />

                {/* Glow blobs */}
                <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <div className="relative flex flex-1 flex-col justify-between p-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="h-12 w-12 rounded-full" />
                        <div>
                            <span className="block text-sm font-bold text-white leading-tight">Focus Digital Color Lab</span>
                            <span className="block text-[10px] font-semibold tracking-widest text-primary uppercase">Premium Photo Studio</span>
                        </div>
                    </Link>

                    {/* Center content */}
                    <div className="space-y-7">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-medium tracking-wide text-primary">Serving Dhaka since 2009</span>
                            </div>
                            <h1 className="text-4xl font-bold leading-tight text-white">
                                Professional photos,
                                <br />
                                <span className="text-primary">Print in 10 minutes.</span>
                            </h1>
                            <p className="text-sm leading-relaxed text-white/50">
                                Passport, Visa, NID, school admission — every official photo accepted on first submission. Two studios in Dhaka.
                            </p>
                        </div>

                        <ul className="space-y-3.5">
                            {[
                                'Track your order status in real time',
                                'Reorder any time with your FDCL Photo ID',
                                'Fujifilm Frontier professional printing',
                                'bKash payment accepted',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                                    <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                            <div className="flex -space-x-1.5">
                                {['bg-violet-500','bg-rose-500','bg-amber-500','bg-cyan-500'].map((c, i) => (
                                    <div key={i} className={`h-7 w-7 rounded-full border-2 border-gray-900 ${c} flex items-center justify-center text-[10px] font-bold text-white`}>
                                        {['R','T','A','S'][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-white">50,000+ happy customers</p>
                                <p className="text-[10px] text-white/40">5.0 ★ on Google</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-white/20">
                        © {new Date().getFullYear()} Focus Digital Color Lab · Bailey Road &amp; Gulshan, Dhaka
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="relative flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-10">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                {/* Mobile logo */}
                <div className="mb-8 lg:hidden flex flex-col items-center gap-2">
                    <Link href="/">
                        <ApplicationLogo className="h-14 w-14 rounded-full" />
                    </Link>
                    <p className="text-xs font-semibold tracking-widest text-primary uppercase">Focus Digital Color Lab</p>
                </div>

                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
