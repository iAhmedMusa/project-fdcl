import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AppWrapper({ children }) {
    return (
        <LanguageProvider>
        <ThemeProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#0D1B2A',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#D4A017',
                            secondary: '#0D1B2A',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#0D1B2A',
                        },
                    },
                }}
            />
            {children}
        </ThemeProvider>
        </LanguageProvider>
    );
}