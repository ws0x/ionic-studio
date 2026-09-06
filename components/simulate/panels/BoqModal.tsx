"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import type { MaterialDef, FurnitureDef, SimulationProject } from "@/lib/simulation/types";
import { buildShareUrl } from "@/lib/simulation/share";
import { site } from "@/lib/site";

export function BoqModal({
  project,
  materials,
  furniture,
  isOpen,
  onClose,
}: {
  project: SimulationProject;
  materials: MaterialDef[];
  furniture: FurnitureDef[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { tx, locale } = useLocale();
  const isAr = locale === "ar";

  const floorMaterialId = useSimStore((s) => s.floorMaterialId);
  const wallMaterialId = useSimStore((s) => s.wallMaterialId);
  const timeOfDay = useSimStore((s) => s.timeOfDay);
  const placements = useSimStore((s) => s.placements);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const w = project.room.size.w;
  const d = project.room.size.d;
  const h = project.room.size.h || 3.0;

  const floorArea = Number((w * d).toFixed(1));
  const wallArea = Number((2 * (w + d) * h).toFixed(1));

  const floorMat = materials.find((m) => m.id === floorMaterialId) || materials[0];
  const wallMat = materials.find((m) => m.id === wallMaterialId) || materials[1];

  const timeLabels: Record<string, { ar: string; en: string }> = {
    morning: { ar: "صباحي / إضاءة طبيعية", en: "Morning Natural" },
    afternoon: { ar: "ظهيرة / ضوء دافئ", en: "Afternoon Warm" },
    evening: { ar: "مسائي / إضاءة غير مباشرة", en: "Evening Indirect" },
    night: { ar: "ليلي / إضاءة خافتة فاخرة", en: "Night Mood" },
  };

  const timeLabel = timeLabels[timeOfDay] || { ar: timeOfDay, en: timeOfDay };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = buildShareUrl(origin, project.id, {
    floorMaterialId,
    wallMaterialId,
    timeOfDay,
    placements,
  });

  const waMessage = isAr
    ? `🏛️ *طلب مقايسة معمارية وجدول كميات (BOQ) - دار أيونيك*
▫️ *الفراغ المُصمم*: ${project.name.ar}
▫️ *الأبعاد*: ${w}م × ${d}م (ارتفاع ${h}م)
▫️ *مساحة الأرضية*: ${floorArea} م² (${floorMat ? floorMat.name.ar : ""})
▫️ *مساحة الحوائط*: ${wallArea} م² (${wallMat ? wallMat.name.ar : ""})
▫️ *عناصر الفرش المُختارة*: ${placements.length} قطع
▫️ *توقيت الإضاءة*: ${timeLabel.ar}
▫️ *رابط التصميم*: ${shareUrl}

أرجو التواصل لتحديد موعد المعاينة وتدقيق جدول الكميات والمواصفات التعاقدية.`
    : `🏛️ *Architectural BOQ & Spec Request - Ionic Design House*
▫️ *Designed Space*: ${project.name.en}
▫️ *Dimensions*: ${w}m × ${d}m (Height ${h}m)
▫️ *Floor Area*: ${floorArea} m² (${floorMat ? floorMat.name.en : ""})
▫️ *Wall Surface*: ${wallArea} m² (${wallMat ? wallMat.name.en : ""})
▫️ *Selected Furniture*: ${placements.length} items
▫️ *Lighting Mood*: ${timeLabel.en}
▫️ *Design Link*: ${shareUrl}

Please contact me to schedule a site survey and finalize the formal BOQ specifications.`;

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  // Tally furniture items
  const furnitureCounts: Record<string, number> = {};
  for (const p of placements) {
    furnitureCounts[p.defId] = (furnitureCounts[p.defId] || 0) + 1;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="boq-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-stone-900 border border-stone-800 p-6 sm:p-8 text-stone-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={tx({ ar: "إغلاق", en: "Close" })}
          className="absolute top-5 end-5 p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="inline-block text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
            {tx({ ar: "جدول الكميات والمواصفات", en: "Architectural BOQ & Spec Sheet" })}
          </span>
          <h2 id="boq-title" className="text-2xl font-light tracking-tight">
            {project.name[locale]}
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            {tx({
              ar: "تم استخراج الكميات والمواصفات تلقائياً من محاكي التصميم ثلاثي الأبعاد.",
              en: "Quantities and surface areas computed live from the 3D simulation scene.",
            })}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
            <span className="text-[11px] text-stone-400 block mb-1">
              {tx({ ar: "مساحة الأرضية", en: "Floor Area" })}
            </span>
            <span className="text-xl font-mono text-amber-300 font-bold">{floorArea}</span>
            <span className="text-xs text-stone-400 ms-1">م²</span>
          </div>

          <div className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
            <span className="text-[11px] text-stone-400 block mb-1">
              {tx({ ar: "مسطح الحوائط", en: "Wall Surface" })}
            </span>
            <span className="text-xl font-mono text-amber-300 font-bold">{wallArea}</span>
            <span className="text-xs text-stone-400 ms-1">م²</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
            <span className="text-[11px] text-stone-400 block mb-1">
              {tx({ ar: "الأبعاد الهندسية", en: "Dimensions" })}
            </span>
            <span className="text-sm font-mono text-stone-200">
              {w} × {d} × {h}m
            </span>
          </div>
        </div>

        {/* Materials Summary */}
        <div className="space-y-3 mb-6 bg-stone-950/40 p-4 rounded-xl border border-stone-800/60 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-400">{tx({ ar: "خامة الأرضيات:", en: "Floor Material:" })}</span>
            <span className="font-medium text-stone-200">{floorMat ? floorMat.name[locale] : "—"}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-400">{tx({ ar: "تشطيب الحوائط:", en: "Wall Finish:" })}</span>
            <span className="font-medium text-stone-200">{wallMat ? wallMat.name[locale] : "—"}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-400">{tx({ ar: "محاكاة الإضاءة:", en: "Lighting Mood:" })}</span>
            <span className="font-medium text-stone-200">{tx(timeLabel)}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-stone-400">{tx({ ar: "عناصر الفرش:", en: "Placed Objects:" })}</span>
            <span className="font-medium text-stone-200">
              {placements.length} {tx({ ar: "قطع", en: "items" })}
            </span>
          </div>
        </div>

        {/* Placed Items Breakdown (if any) */}
        {Object.keys(furnitureCounts).length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-semibold">
              {tx({ ar: "قائمة الفرش المحدد:", en: "Selected Furniture Breakdown:" })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(furnitureCounts).map(([fId, count]) => {
                const item = furniture.find((f) => f.id === fId);
                const name = item ? item.name[locale] : fId;
                return (
                  <span
                    key={fId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-stone-300"
                  >
                    <span>{name}</span>
                    <strong className="text-amber-400 font-mono">×{count}</strong>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-center text-sm transition shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>{tx({ ar: "إرسال المقايسة لواتساب", en: "Send BOQ to WhatsApp" })}</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            {tx({ ar: "العودة للمحاكي", en: "Back to Simulator" })}
          </button>
        </div>
      </div>
    </div>
  );
}
