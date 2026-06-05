"use client";

import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PageHero } from "@/components/PageHero";
import { founders } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Quote } from "@/components/Quote";

function FoundersContent() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHero
        eyebrow={t("founders.eyebrow")}
        title={t("founders.title")}
        subtitle={t("founders.subtitle")}
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-28">
          {founders.map((f, i) => (
            <article key={i} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

              {/* Portrait — alternates side */}
              <Reveal
                className={`${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-mist">
                  <img
                    src={f.image}
                    alt={`${f.name.en}, ${f.title.en}, Ionic Design House`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top grayscale transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </Reveal>

              {/* Bio */}
              <Reveal delay={120} className={`flex flex-col justify-center pt-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-platinum">
                  {f.title[locale]}
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">
                  {f.name[locale]}
                </h2>

                <div className="mt-7 space-y-4">
                  <p className="text-base leading-loose text-platinum">{f.bio1[locale]}</p>
                  <p className="text-base leading-loose text-platinum">{f.bio2[locale]}</p>
                </div>

                {/* Credentials */}
                <div className="mt-8">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-platinum">
                    {t("founders.credentials")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {f.credentials.map((c, ci) => (
                      <span
                        key={ci}
                        className="rounded-full border border-line bg-mist px-4 py-2 text-xs font-medium text-ink"
                      >
                        {c[locale]}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <Quote />
    </>
  );
}

export default function FoundersPage() {
  return (
    <LocaleProvider>
      <Nav />
      <main>
        <FoundersContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LocaleProvider>
  );
}
