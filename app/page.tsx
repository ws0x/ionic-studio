"use client";

import { LocaleProvider } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Quote } from "@/components/Quote";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { FoundersTeaser } from "@/components/FoundersTeaser";
import { ClientLocations } from "@/components/ClientLocations";
import CostEstimator from "@/components/CostEstimator";
import BeforeAfter from "@/components/BeforeAfter";
import { CareersSection } from "@/components/CareersSection";

export default function Home() {
  return (
    <LocaleProvider>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Portfolio limit={6} showViewAll />
        <BeforeAfter />
        <ClientLocations />
        <CostEstimator />
        <About />
        <FoundersTeaser />
        <Testimonials limit={3} showViewAll />
        <CareersSection />
        <Quote />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LocaleProvider>
  );
}
