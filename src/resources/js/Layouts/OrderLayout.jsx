import { Link } from '@inertiajs/react';
import useFlash from '@/hooks/useFlash';

export default function OrderLayout({ children }) {
    useFlash();
    
    return (
        <div className="min-h-screen bg-navy font-inter">
            {/* Top Bar */}
            <nav className="border-b border-white/10 bg-navy">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
                    <a href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="FDCL"
                            className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
                        />
                        <span className="text-sm font-bold text-white sm:text-base">
                            Focus Digital Color Lab
                        </span>
                    </a>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
                {children}
            </main>
        </div>
    );
}
