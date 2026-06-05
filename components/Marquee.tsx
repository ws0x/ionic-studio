"use client";

import { useLocale } from "@/lib/i18n";

const items = {
  ar: ["تصميم داخلي", "تشطيبات فاخرة", "ديكور", "جبسوم بورد", "دهانات", "مطابخ", "إنشاءات", "تسليم مفتاح"],
  en: ["Interior Design", "Luxury Finishing", "Décor", "Gypsum Works", "Painting", "Kitchens", "Construction", "Turnkey Delivery"],
};

const sep = "  ·  ";

export function Marquee() {
  const { locale } = useLocale();
  const row = [...items[locale], ...items[locale]];

  return (
    <div className="overflow-hidden border-y border-line bg-off-white py-5">
      <div className="marquee-track flex w-max items-center gap-0 whitespace-nowrap">
        {row.map((it, i) => (
          <span key={i} className="text-[11px] font-medium uppercase tracking-[0.2em] text-platinum">
            {it}{sep}
          </span>
        ))}
      </div>
    </div>
  );
}
