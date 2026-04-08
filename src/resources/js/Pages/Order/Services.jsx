import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const services = [
    {
        id: 'photo-studio',
        title: 'Photo Studio',
        description: 'Book an appointment for passport photos, visa photos, portraits and more.',
        href: '/order/photo-studio',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
        ),
        tags: ['Walk-in', 'Appointment', '10-min express'],
    },
    {
        id: 'photo-reprint',
        title: 'Photo Reprint',
        description: 'Reorder prints using your FDCL Photo ID or upload your own photo.',
        href: '/order/reprint',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-3 0h.008v.008h-.008V12Z" />
            </svg>
        ),
        tags: ['Photo ID', 'Upload', 'Any size'],
    },
    {
        id: 'album',
        title: 'Photo Album',
        description: 'Custom photo albums with premium printing and binding.',
        href: '/order/album',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        tags: ['Custom design', 'Premium quality'],
    },
    {
        id: 'frame',
        title: 'Photo Frame',
        description: 'Beautiful photo frames in various sizes and styles.',
        href: '/order/frame',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865  0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            </svg>
        ),
        tags: ['Multiple sizes', 'Photo upload'],
    },
    {
        id: 'mug',
        title: 'Photo Mug',
        description: 'Personalized photo mugs for gifts and memories.',
        href: '/order/mug',
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597-.237 1.17-.659 1.591L10 14.5m4.25-11.382c.251.023.501.05.75.082M19 8.25a2.25 2.25 0 0 1 2.25 2.25v.75a2.25 2.25 0 0 1-2.25 2.25h-.5m-13.5 0v3.75a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 0 4.5-4.5v-3.75m-13.5 0h13.5" />
            </svg>
        ),
        tags: ['Custom design', 'Great for gifts'],
    },
];

export default function Services() {
    return (
        <CustomerLayout>
            <Head title="New Order - FDCL" />

            <div className="mb-5">
                <h1 className="text-lg font-semibold">New Order</h1>
                <p className="text-sm text-muted-foreground">Choose a service to get started.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                    <Link
                        key={service.id}
                        href={service.href}
                        className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
                    >
                        <div className="mb-3 inline-flex rounded-md bg-primary/10 p-2.5 text-primary">
                            {service.icon}
                        </div>
                        <h3 className="text-sm font-semibold group-hover:text-primary">{service.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {service.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </CustomerLayout>
    );
}
