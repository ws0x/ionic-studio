"use client";

import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PageHero } from "@/components/PageHero";
import { Testimonials } from "@/components/Testimonials";
import { Quote } from "@/components/Quote";

function TestimonialsContent() {
  const { locale } = useLocale();
  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "آراء العملاء" : "Client voices"}
        title={locale === "ar" ? "ماذا يقول عملاؤنا" : "What our clients say"}
        subtitle={
          locale === "ar"
            ? "أكثر من 250 مشروع منجز وعملاء يتحدثون بأنفسهم عن التجربة."
            : "Over 250 projects delivered and clients who speak for themselves."
        }
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
      />
      <Testimonials />
      <Quote />
    </>
  );
}

export default function TestimonialsPage() {
  return (
    <LocaleProvider>
      <Nav />
      <main>
        <TestimonialsContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LocaleProvider>
  );
}
