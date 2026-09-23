'use client';

import FadeIn from '../components/FadeIn';
import About from '../components/landing/About';
import Contact from '../components/landing/Contact';
import FAQ from '../components/landing/FAQ';
import Gallery from '../components/landing/Gallery';
import Hero from '../components/landing/Hero';
import Locations from '../components/landing/Locations';
import Services from '../components/landing/Services';
import Testimonials from '../components/landing/Testimonials';
import LandingLayout from '../components/LandingLayout';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <LandingLayout>
          <Hero />
          <FadeIn>
            <Services />
          </FadeIn>
          <FadeIn>
            <Gallery />
          </FadeIn>
          <FadeIn>
            <About />
          </FadeIn>
          <FadeIn>
            <Testimonials />
          </FadeIn>
          <FadeIn>
            <Locations />
          </FadeIn>
          <FadeIn>
            <FAQ />
          </FadeIn>
          <FadeIn>
            <Contact />
          </FadeIn>
        </LandingLayout>
      </ThemeProvider>
    </LanguageProvider>
  );
}
