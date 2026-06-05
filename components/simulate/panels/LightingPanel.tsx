"use client";

import { useLocale } from "@/lib/i18n";
import { useSimStore } from "@/lib/simulation/store";

/** Time-of-day slider that drives the sun simulation. */
export function LightingPanel() {
  const { tx } = useLocale();
  const timeOfDay = useSimStore((s) => s.timeOfDay);
  const setTimeOfDay = useSimStore((s) => s.setTimeOfDay);

  const hh = Math.floor(timeOfDay);
  const mm = Math.round((timeOfDay - hh) * 60);
  const label = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

  const presets = [
    { h: 7, label: { ar: "الفجر", en: "Dawn" }, icon: "🌅" },
    { h: 13, label: { ar: "الظهيرة", en: "Midday" }, icon: "☀️" },
    { h: 18, label: { ar: "الغروب", en: "Sunset" }, icon: "🌇" },
    { h: 22, label: { ar: "الليل", en: "Night" }, icon: "🌙" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-platinum">
            {tx({ ar: "وقت اليوم", en: "Time of day" })}
          </p>
          <span dir="ltr" className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-paper">
            {label}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={24}
          step={0.5}
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(Number(e.target.value))}
          aria-label={tx({ ar: "وقت اليوم", en: "Time of day" })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-indigo-900 via-amber-300 to-indigo-900 accent-ink"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {presets.map((p) => (
          <button
            key={p.h}
            onClick={() => setTimeOfDay(p.h)}
            className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-[10px] font-semibold transition cursor-pointer ${
              Math.abs(timeOfDay - p.h) < 0.5 ? "border-ink bg-mist text-ink" : "border-line text-platinum hover:border-platinum"
            }`}
          >
            <span className="text-base leading-none">{p.icon}</span>
            {tx(p.label)}
          </button>
        ))}
      </div>
    </div>
  );
}
