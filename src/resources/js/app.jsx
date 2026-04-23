import '../css/app.css';
import './bootstrap';

import AppWrapper from '@/Components/AppWrapper';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import toast from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Intercept non-Inertia error responses and show a compact centered toast
router.on('invalid', (event) => {
    try {
        event.preventDefault();
        const response = event.detail?.response;
        const status = response?.status;

        const labels = { 401: 'Login Required', 403: 'Access Denied', 404: 'Not Found', 500: 'Server Error' };
        const fallbacks = {
            401: 'Login Required — Please sign in to continue.',
            403: "Access Denied — You can't serve Studio Service from different location, change pick up location.",
            404: 'Not Found — The requested page does not exist.',
            500: 'Server Error — Please try again or contact support.',
        };

        if (status === 401) {
            window.location.href = '/login';
            return;
        }

        if (!status || !(status in fallbacks)) return;

        const toastOpts = { duration: 6000, position: 'top-center' };

        const html = typeof response.data === 'string' ? response.data : '';
        const titleText = (html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] ?? '').trim();
        const reason = titleText.replace(/^\d+\s*[|]\s*/i, '').replace(/\s*[-–]\s*.+$/, '').trim();
        const isUsable = reason.length > 3 && reason.length < 150 && !/laravel|ignition|whoops|forbidden/i.test(reason);
        const message = isUsable ? `${labels[status]} — ${reason}` : fallbacks[status];
        toast.error(message, toastOpts);
    } catch (e) {
        // silently ignore
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AppWrapper>
                <App {...props} />
            </AppWrapper>
        );
    },
    progress: {
        color: '#D4A017',
    },
});
