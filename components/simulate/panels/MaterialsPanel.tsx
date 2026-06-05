"use client";

import { useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import type { MaterialDef } from "@/lib/simulation/types";

/** Material picker grouped by floor / wall, with a relative cost-tier indicator. */
export function MaterialsPanel({ materials }: { materials: MaterialDef[] }) {
  const { tx, locale } = useLocale();
  const floorMaterialId = useSimStore((s) => s.floorMaterialId);
  const wallMaterialId = useSimStore((s) => s.wallMaterialId);
  const setMaterial = useSimStore((s) => s.setMaterial);

  const floors = materials.filter((m) => m.category === "floor");
  const walls = materials.filter((m) => m.category === "wall");

  return (
    <div className="space-y-6">
      <Group
        title={tx({ ar: "الأرضية", en: "Flooring" })}
        items={floors}
        activeId={floorMaterialId}
        onPick={(id) => setMaterial("floor", id)}
        locale={locale}
      />
      <Group
        title={tx({ ar: "الجدران", en: "Walls" })}
        items={walls}
        activeId={wallMaterialId}
        onPick={(id) => setMaterial("wall", id)}
        locale={locale}
      />
    </div>
  );
}

function Group({
  title,
  items,
  activeId,
  onPick,
  locale,
}: {
  title: string;
  items: MaterialDef[];
  activeId: string;
  onPick: (id: string) => void;
  locale: "ar" | "en";
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-platinum">{title}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((m) => {
          const active = m.id === activeId;
          return (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              aria-pressed={active}
              className={`group flex flex-col gap-2 rounded-xl border p-2 text-start transition cursor-pointer ${
                active ? "border-ink ring-1 ring-ink" : "border-line hover:border-platinum"
              }`}
            >
              <span
                className="h-12 w-full rounded-lg border border-line/60"
                style={{ background: m.color }}
              />
              <span className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-ink">{m.name[locale]}</span>
                <span className="text-[9px] text-platinum" title={`Cost tier ${m.costTier}`}>
                  {"●".repeat(m.costTier)}
                  {"○".repeat(3 - m.costTier)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
