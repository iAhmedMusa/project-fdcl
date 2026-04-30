<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Focus Digital Color Lab') }}</title>

        <!-- SEO / Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Focus Digital Color Lab">
        <meta property="og:title" content="Premium Photo Studio &amp; Lab in Dhaka">
        <meta property="og:description" content="15+ years Experienced in Photo Studio Service | All embassy-approved visa applicant biometric/Visa photos">
        <meta property="og:url" content="https://focusdigitalcolorlab.com">
        <meta property="og:image" content="https://focusdigitalcolorlab.com/fdcl_og.png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="628">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Premium Photo Studio &amp; Lab in Dhaka">
        <meta name="twitter:description" content="15+ years Experienced in Photo Studio Service | All embassy-approved visa applicant biometric/Visa photos">
        <meta name="twitter:image" content="https://focusdigitalcolorlab.com/fdcl_og.png">

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/logo-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/logo-512x512.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
