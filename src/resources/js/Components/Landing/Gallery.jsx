import { useCallback, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Gallery() {
    const { t } = useLanguage();
    const [activeIdx, setActiveIdx] = useState(0);
    const scrollRef = useRef(null);

    const galleryPhotos = [
        { src: '/images/studio/studio-04.jpg', alt: 'Focus Digital Color Lab Bailey Road studio exterior, Dhaka', caption: t.gallery.captions[0] },
        { src: '/images/studio/studio-24.jpg', alt: 'Focus Digital Color Lab Gulshan studio exterior, Dhaka', caption: t.gallery.captions[1] },
        { src: '/images/studio/studio-02.jpg', alt: 'Professional Godox studio lighting setup for passport photos', caption: t.gallery.captions[2] },
        { src: '/images/studio/studio-03.jpg', alt: 'Comfortable waiting area inside FDCL photo studio Dhaka', caption: t.gallery.captions[3] },
        { src: '/images/studio/studio-01.jpg', alt: 'Fujifilm Frontier DE100 professional photo printer', caption: t.gallery.captions[4] },
        { src: '/images/studio/studio-05.jpg', alt: 'Fujifilm Frontier-S photo processing machine at FDCL', caption: t.gallery.captions[5] },
        { src: '/images/studio/studio-17.jpg', alt: 'FDCL photo studio production equipment setup', caption: t.gallery.captions[6] },
        { src: '/images/studio/studio-32.jpg', alt: 'Fujifilm photo printing machines stacked at FDCL Dhaka', caption: t.gallery.captions[7] },
        { src: '/images/studio/studio-22.jpg', alt: 'FDCL photo studio Gulshan exterior storefront', caption: t.gallery.captions[8] },
        { src: '/images/studio/studio-25.jpg', alt: 'Focus Digital Color Lab signage and studio front', caption: t.gallery.captions[9] },
        { src: '/images/studio/studio-07.jpg', alt: 'FDCL print lab equipment and workstation', caption: t.gallery.captions[10] },
        { src: '/images/studio/studio-09.jpg', alt: 'Professional photo printing setup at FDCL Dhaka', caption: t.gallery.captions[11] },
    ];

    const scrollTo = useCallback((idx) => {
        const clamped = Math.max(0, Math.min(idx, galleryPhotos.length - 1));
        setActiveIdx(clamped);
        const container = scrollRef.current;
        if (!container) return;
        const card = container.children[clamped];
        if (card) {
            container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
        }
    }, [galleryPhotos.length]);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
            if (dist < minDist) { minDist = dist; closest = i; }
        }
        setActiveIdx(closest);
    }, []);

    return (
        <section id="gallery" className="bg-gray-950 px-4 py-20 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/80">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v10.5A2.25 2.25 0 003.75 20.25z" />
                        </svg>
                        {t.gallery.badge}
                    </span>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {t.gallery.title1}{' '}
                        <span className="text-primary">{t.gallery.title2}</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                        {t.gallery.subtitle}
                    </p>
                </div>

                <div className="relative sm:hidden">
                    <button
                        onClick={() => scrollTo(activeIdx - 1)}
                        className="absolute -left-1 top-1/2 z-10 flex h-9 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/20 text-white shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:bg-white/35 hover:border-white/25 cursor-pointer"
                        aria-label="Previous photo"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollTo(activeIdx + 1)}
                        className="absolute -right-1 top-1/2 z-10 flex h-9 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/20 text-white shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:bg-white/35 hover:border-white/25 cursor-pointer"
                        aria-label="Next photo"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {galleryPhotos.map((photo, idx) => (
                            <div
                                key={idx}
                                className="relative w-[72vw] shrink-0 snap-center overflow-hidden rounded-2xl cursor-pointer"
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    className="h-48 w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-xs font-semibold text-white">{photo.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex justify-center gap-1.5">
                        {galleryPhotos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollTo(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-white/30'
                                }`}
                                aria-label={`Go to photo ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden sm:block sm:columns-3 lg:columns-4 sm:gap-3">
                    {galleryPhotos.map((photo, idx) => (
                        <div
                            key={idx}
                            className="group relative mb-3 overflow-hidden rounded-xl break-inside-avoid cursor-pointer"
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                                <p className="text-sm font-semibold text-white">{photo.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                    <p className="text-lg font-semibold text-white">
                        {t.gallery.callout1}
                    </p>
                    <p className="mt-2 text-gray-400">
                        {t.gallery.callout2}
                    </p>
                </div>
            </div>
        </section>
    );
}