import { Head } from '@inertiajs/react';
import LandingLayout from '@/Layouts/LandingLayout';
import Hero from '@/Components/Landing/Hero';
import Services from '@/Components/Landing/Services';
import About from '@/Components/Landing/About';
import Locations from '@/Components/Landing/Locations';
import Contact from '@/Components/Landing/Contact';

export default function Home() {
    return (
        <LandingLayout>
            <Head title="Home" />
            <Hero />
            <Services />
            <About />
            <Locations />
            <Contact />
        </LandingLayout>
    );
}
