"use client";

import { useLocale } from "@/lib/i18n";

interface ClientBrand {
  name: string;
  sector: { ar: string; en: string };
  symbol: string;
}

const enterpriseClients: ClientBrand[] = [
  { name: "Valu", sector: { ar: "خدمات مالية", en: "FinTech & Banking" }, symbol: "VALU" },
  { name: "PAUL", sector: { ar: "مطاعم وكافيهات راقية", en: "F&B Luxury Bakery" }, symbol: "PAUL" },
  { name: "Starbucks", sector: { ar: "كافيهات عالمية", en: "Global F&B" }, symbol: "SBUX" },
  { name: "Hugo Boss", sector: { ar: "أزياء عالمية فاخرة", en: "Luxury Fashion Retail" }, symbol: "BOSS" },
  { name: "Philipp Plein", sector: { ar: "أزياء راقية", en: "Haute Couture Retail" }, symbol: "PLEIN" },
  { name: "Costa Coffee", sector: { ar: "سلسلة مقاهي", en: "Commercial F&B" }, symbol: "COSTA" },
  { name: "KIKO Milano", sector: { ar: "مستحضرات تجميل", en: "Cosmetics Retail" }, symbol: "KIKO" },
  { name: "Aldo", sector: { ar: "علامة أزياء كبرى", en: "Global Footwear Retail" }, symbol: "ALDO" },
  { name: "Clarks", sector: { ar: "أحذية وأزياء", en: "British Heritage Retail" }, symbol: "CLARKS" },
  { name: "La Martina", sector: { ar: "أزياء راقية", en: "Luxury Sports Retail" }, symbol: "LA MARTINA" },
  { name: "EDECS", sector: { ar: "مقاولات بحرية وهندسية", en: "Maritime & Heavy Civil" }, symbol: "EDECS" },
  { name: "Ariika", sector: { ar: "أثاث وتصميم منزلي", en: "Modern Furniture Retail" }, symbol: "ARIIKA" },
  { name: "3 Brothers", sector: { ar: "حلول الإضاءة المعمارية", en: "Architectural Lighting" }, symbol: "3BROTHERS" },
  { name: "CAF", sector: { ar: "سلسلة مقاهي متخصصة", en: "Specialty Coffee" }, symbol: "CAF" },
  { name: "Emaar Mivida", sector: { ar: "فيلات سكنية فاخرة", en: "Luxury Residential" }, symbol: "EMAAR" },
  { name: "Mountain View", sector: { ar: "كمبوندات راقية", en: "Premium Living" }, symbol: "MV" },
];

export function Marquee() {
  const { locale } = useLocale();
  const doubleClients = [...enterpriseClients, ...enterpriseClients];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black py-8">
      {/* Subtle background architectural watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
        <span className="text-stroke-light text-6xl font-bold uppercase tracking-widest sm:text-8xl">
          OUR CLIENTS & BRANDS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-bronze" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">
            {locale === "ar" ? "شركاء النجاح وكبرى العلامات الدولية" : "Our Clients & Enterprise Partners"}
          </h3>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-white/40 hidden sm:inline">
          {locale === "ar" ? "+30 علامة تجارية ومؤسسة عالمية" : "+30 International Companies"}
        </span>
      </div>

      <div className="marquee-track flex w-max items-center gap-6 whitespace-nowrap will-change-transform">
        {doubleClients.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="group flex items-center gap-4 rounded-none border border-white/10 bg-white/[0.03] px-6 py-3 transition-all hover:border-bronze/60 hover:bg-white/[0.08]"
          >
            <div className="flex h-7 w-7 items-center justify-center border border-white/20 bg-black font-mono text-[10px] font-bold text-bronze-light group-hover:border-bronze">
              {client.symbol.slice(0, 3)}
            </div>
            <div>
              <span className="block font-bold tracking-wider text-white text-sm group-hover:text-bronze-light transition-colors">
                {client.name}
              </span>
              <span className="block text-[10px] text-white/40 font-mono">
                {client.sector[locale]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

