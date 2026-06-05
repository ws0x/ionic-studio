"use client";

import { useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import { formatFootprint } from "@/lib/simulation/dimensions";
import type { FurnitureDef } from "@/lib/simulation/types";

/** Catalogue of furniture; tap to add to the room centre. */
export function FurniturePanel({ furniture }: { furniture: FurnitureDef[] }) {
  const { tx, locale } = useLocale();
  const addFurniture = useSimStore((s) => s.addFurniture);
  const placements = useSimStore((s) => s.placements);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-platinum">
        {tx({
          ar: "اضغط لإضافة قطعة، ثم اسحبها لتحريكها.",
          en: "Tap to add an item, then drag it to move.",
        })}
      </p>

      <div className="grid grid-cols-1 gap-2">
        {furniture.map((f) => (
          <button
            key={f.id}
            onClick={() => addFurniture(f.id)}
            className="flex items-center gap-3 rounded-xl border border-line p-2.5 text-start transition hover:border-ink hover:bg-mist cursor-pointer"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ background: f.color }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11V7a2 2 0 012-2h12a2 2 0 012 2v4M3 11h18v6H3zM6 17v2M18 17v2" />
              </svg>
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-xs font-semibold text-ink">{f.name[locale]}</span>
              <span dir="ltr" className="text-[10px] text-platinum">
                {formatFootprint(f, locale)}
              </span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-platinum">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        ))}
      </div>

      <p className="pt-1 text-[10px] text-platinum">
        {tx({ ar: "القطع المضافة", en: "Items placed" })}: {placements.length}
      </p>
    </div>
  );
}
