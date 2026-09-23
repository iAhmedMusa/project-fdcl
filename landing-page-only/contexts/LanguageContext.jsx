'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { en } from '../translations/en';
import { bn } from '../translations/bn';

const LanguageContext = createContext(undefined);

const translations = { en, bn };

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        if (typeof window === 'undefined') return 'en';
        return localStorage.getItem('lang') === 'bn' ? 'bn' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.classList.toggle('lang-bn', lang === 'bn');
    }, [lang]);

    const toggleLang = () => setLang((prev) => (prev === 'en' ? 'bn' : 'en'));

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}