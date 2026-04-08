import { Head } from '@inertiajs/react'

export default function Home() {
    return (
        <>
            <Head title="Focus Digital Color Lab" />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'sans-serif'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600' }}>
                    Focus Digital Color Lab
                </h1>
                <p style={{ color: '#666' }}>
                    Development environment is running.
                </p>
                <p style={{ color: '#999', fontSize: '14px' }}>
                    Laravel + Inertia.js + React + MySQL + Mailpit
                </p>
            </div>
        </>
    )
}
