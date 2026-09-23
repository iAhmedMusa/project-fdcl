'use client';

import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

function FAQItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
            <button
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-primary cursor-pointer"
                aria-expanded={isOpen}
            >
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {faq.q}
                </span>
                <span className={`mt-0.5 shrink-0 rounded-full bg-gray-100 p-1 text-gray-500 transition-all dark:bg-gray-700 dark:text-gray-400 ${isOpen ? 'rotate-180 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' : ''}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <div className="pb-5">
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                        {faq.a}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = t.faq.items;

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };

    return (
        <section id="faq" className="bg-white px-4 py-20 dark:bg-gray-950 sm:px-6 lg:py-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary dark:bg-primary/20">
                            {t.faq.badge}
                        </span>
                        <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t.faq.title}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            {t.faq.subtitle}
                        </p>

                        <div className="mt-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.faq.stillQuestions}</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.faq.stillQuestionsSub}</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <a
                                    href="tel:+8801713140768"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    {t.faq.phone}
                                </a>
                                <a
                                    href="https://wa.me/8801973140768"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    {t.faq.whatsapp}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {faqs.map((faq, idx) => (
                                <FAQItem
                                    key={idx}
                                    faq={faq}
                                    isOpen={openIndex === idx}
                                    onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}