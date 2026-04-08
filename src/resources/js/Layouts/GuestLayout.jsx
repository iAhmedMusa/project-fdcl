import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import useFlash from '@/hooks/useFlash';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    useFlash();

    return (
        <div className="flex min-h-screen">
            {/* Left brand panel */}
            <div className="relative hidden lg:flex lg:w-[45%] xl:w-2/5 flex-col overflow-hidden bg-zinc-950">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-black" />

                {/* Blue accent glow */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative flex flex-1 flex-col justify-between p-10">
                    {/* Logo */}
                    <div>
                        <Link href="/">
                            <ApplicationLogo className="h-12 w-auto brightness-0 invert" />
                        </Link>
                    </div>

                    {/* Center content */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                <span className="text-xs font-medium tracking-wide text-blue-400">
                                    Premium Photo Studio
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold leading-tight text-white">
                                Professional photography,
                                <br />
                                <span className="text-blue-400">perfectly printed.</span>
                            </h1>
                            <p className="text-base leading-relaxed text-zinc-400">
                                Professional photo printing & development in Dhaka. Trusted by photographers and families since day one.
                            </p>
                        </div>

                        {/* Feature list */}
                        <ul className="space-y-3">
                            {[
                                'High-quality prints & digital processing',
                                'Fast turnaround, reliable delivery',
                                'Track your orders in real time',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-zinc-400">
                                    <svg className="h-4 w-4 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-zinc-600">
                        © {new Date().getFullYear()} Focus Digital Color Lab, Dhaka
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="relative flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-10">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                {/* Mobile logo */}
                <div className="mb-8 lg:hidden">
                    <Link href="/">
                        <ApplicationLogo className="h-12 w-auto" />
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
