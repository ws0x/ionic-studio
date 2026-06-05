"use client";

import { useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";
import type { FurnitureDef } from "@/lib/simulation/types";

/** Floating toolbar shown when a furniture item is selected: rotate / delete. */
export function SelectedToolbar({ furniture }: { furniture: FurnitureDef[] }) {
  const { tx, locale } = useLocale();
  const selectedId = useSimStore((s) => s.selectedId);
  const placements = useSimStore((s) => s.placements);
  const rotateSelected = useSimStore((s) => s.rotateSelected);
  const removeSelected = useSimStore((s) => s.removeSelected);
  const deselect = useSimStore((s) => s.select);

  if (!selectedId) return null;
  const placement = placements.find((p) => p.id === selectedId);
  const def = placement && furniture.find((f) => f.id === placement.defId);
  if (!def) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center p-2">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-paper/95 p-1 shadow-xl backdrop-blur-md">
        <span className="px-3 text-xs font-bold text-ink">{def.name[locale]}</span>
        <span className="h-6 w-px bg-line" />
        <button
          onClick={() => rotateSelected(-Math.PI / 12)}
          aria-label={tx({ ar: "تدوير لليسار", en: "Rotate left" })}
          className="flex items-center justify-center rounded-full px-3 py-2 text-ink transition hover:bg-mist cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 109-9 M3 12v-4 M3 12h4" />
          </svg>
        </button>
        <button
          onClick={() => rotateSelected(Math.PI / 12)}
          aria-label={tx({ ar: "تدوير لليمين", en: "Rotate right" })}
          className="flex items-center justify-center rounded-full px-3 py-2 text-ink transition hover:bg-mist cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 11-9-9 M21 12v-4 M21 12h-4" />
          </svg>
        </button>
        <span className="h-6 w-px bg-line" />
        <button
          onClick={removeSelected}
          aria-label={tx({ ar: "حذف", en: "Delete" })}
          className="flex items-center justify-center rounded-full px-3 py-2 text-red-600 transition hover:bg-red-50 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18 M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
        </button>
        <button
          onClick={() => deselect(null)}
          aria-label={tx({ ar: "إلغاء التحديد", en: "Deselect" })}
          className="flex items-center justify-center rounded-full px-3 py-2 text-platinum transition hover:bg-mist cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18 M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
