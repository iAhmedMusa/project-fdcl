import FadeIn from '@/Components/FadeIn';
import About from '@/Components/Landing/About';
import Contact from '@/Components/Landing/Contact';
import FAQ from '@/Components/Landing/FAQ';
import Gallery from '@/Components/Landing/Gallery';
import Hero from '@/Components/Landing/Hero';
import Locations from '@/Components/Landing/Locations';
import Services from '@/Components/Landing/Services';
import Testimonials from '@/Components/Landing/Testimonials';
import LandingLayout from '@/Layouts/LandingLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Head } from '@inertiajs/react';

const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'PhotoStudio',
            '@id': 'https://focusdigitalcolorlab.com/#studio',
            name: 'Focus Digital Color Lab',
            alternateName: 'FDCL Photo Studio',
            description:
                'Premium photo studio in Dhaka offering passport photos, visa photos, photo albums, custom frames, and mug prints. Serving Gulshan and Bailey Road since 2009.',
            url: 'https://focusdigitalcolorlab.com',
            telephone: '+8801713140768',
            priceRange: '৳৳',
            currenciesAccepted: 'BDT',
            paymentAccepted: 'Cash, bKash, Nagad',
            openingHours: ['Sa-Th 09:30-21:00', 'Fr 15:00-21:00'],
            hasMap: 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
            image: 'https://focusdigitalcolorlab.com/images/studio/studio-04.jpg',
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '500',
                bestRating: '5',
            },
            location: [
                {
                    '@type': 'Place',
                    name: 'FDCL Bailey Road Studio',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'Shantinagar Moar, Bailey Road',
                        addressLocality: 'Dhaka',
                        postalCode: '1217',
                        addressCountry: 'BD',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: '23.7405',
                        longitude: '90.4100',
                    },
                },
                {
                    '@type': 'Place',
                    name: 'FDCL Gulshan Studio',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'House 5, Road 21, Gulshan-1',
                        addressLocality: 'Dhaka',
                        postalCode: '1212',
                        addressCountry: 'BD',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: '23.7806',
                        longitude: '90.4154',
                    },
                },
            ],
        },
    ],
};

export default function Home() {
    const { t } = useLanguage();

    const title = t.nav.brand + ' | ' + t.nav.brandSub + ' in Dhaka';
    const description = t.footer.description;

    return (
        <LandingLayout>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={description}
                />
                <meta
                    name="keywords"
                    content="photo studio Dhaka, Photo Lab, passport photo Dhaka, visa photo Gulshan, photo studio Bailey Road, photo studio near Gulshan, passport size photo Dhaka, FDCL photo studio, photo print Dhaka"
                />
                <meta property="og:title" content={title} />
                <meta
                    property="og:description"
                    content={description}
                />
                <meta property="og:image" content="/images/studio/studio-04.jpg" />
                <meta property="og:type" content="business.business" />
                <link rel="canonical" href="https://focusdigitalcolorlab.com" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Head>
            <Hero />
            <FadeIn><Services /></FadeIn>
            <FadeIn><Gallery /></FadeIn>
            <FadeIn><About /></FadeIn>
            <FadeIn><Testimonials /></FadeIn>
            <FadeIn><Locations /></FadeIn>
            <FadeIn><FAQ /></FadeIn>
            <FadeIn><Contact /></FadeIn>
        </LandingLayout>
    );
}
