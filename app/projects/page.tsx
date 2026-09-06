"use client";

import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Portfolio } from "@/components/Portfolio";
import { PageHero } from "@/components/PageHero";
import { Quote } from "@/components/Quote";

function ProjectsContent() {
  const { t, locale } = useLocale();
  return (
    <>
      <PageHero
        eyebrow={t("work.eyebrow")}
        title={locale === "ar" ? "أعمالنا الكاملة" : "Our complete portfolio"}
        subtitle={
          locale === "ar"
            ? "استعرض مشاريعنا المنجزة في التصميم الداخلي والتشطيبات والإنشاءات عبر مصر."
            : "Browse our completed projects in interior design, finishing and construction across Egypt."
        }
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80"
      />
      <Portfolio showFilters showViewAll={false} />
      <Quote />
    </>
  );
}

export default function ProjectsPage() {
  return (
    <LocaleProvider>
      <Nav />
      <main>
        <ProjectsContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LocaleProvider>
  );
}
