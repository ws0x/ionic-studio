"use client";

import { useState, useEffect } from "react";
import type { FinishingPackage } from "@/lib/content";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<FinishingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/packages")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ packages: [] })))
      .then((data) => {
        if (active) {
          setPackages(data.packages || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    id: FinishingPackage["id"],
    field: "minRate" | "maxRate" | "turnaroundMonths",
    value: number
  ) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
    );
  };

  const handleSave = async (pkg: FinishingPackage) => {
    setSavingId(pkg.id);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pkg.id,
          minRate: pkg.minRate,
          maxRate: pkg.maxRate,
          turnaroundMonths: pkg.turnaroundMonths,
        }),
      });

      if (res.ok) {
        setSavedId(pkg.id);
        setTimeout(() => setSavedId(null), 3000);
      }
    } catch (err) {
      console.error("Failed to save package:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
          Market Pricing Control
        </span>
        <h1 className="text-3xl font-light text-stone-100 tracking-tight">
          Finishing Packages & EGP/m² Rates
        </h1>
        <p className="text-stone-400 text-xs mt-1.5 max-w-2xl">
          Adjust turn-key finishing rates in response to Egyptian market material prices.
          Changes reflect immediately on the public Cost Estimator without code deployments.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400 text-sm">
          Loading package specifications…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isSaving = savingId === pkg.id;
            const isSaved = savedId === pkg.id;
            const sampleArea = 200;
            const sampleMin = (pkg.minRate * sampleArea).toLocaleString();
            const sampleMax = (pkg.maxRate * sampleArea).toLocaleString();

            return (
              <div
                key={pkg.id}
                className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-medium text-stone-100">
                      {pkg.name.en} ({pkg.name.ar})
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {pkg.id}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 mb-6">
                    {pkg.tagline.en} · {pkg.tagline.ar}
                  </p>

                  {/* Rate Inputs */}
                  <div className="space-y-4 bg-stone-950/60 p-4 rounded-xl border border-stone-800 mb-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                        Minimum Rate (EGP / m²)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={pkg.minRate}
                        onChange={(e) =>
                          handleChange(pkg.id, "minRate", Number(e.target.value))
                        }
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm font-mono text-amber-300 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                        Maximum Rate (EGP / m²)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={pkg.maxRate}
                        onChange={(e) =>
                          handleChange(pkg.id, "maxRate", Number(e.target.value))
                        }
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm font-mono text-amber-300 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                        Turnaround Timeline (Months)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        max="12"
                        value={pkg.turnaroundMonths}
                        onChange={(e) =>
                          handleChange(
                            pkg.id,
                            "turnaroundMonths",
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm font-mono text-stone-200 outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Live Simulation Preview */}
                  <div className="p-3 bg-stone-950/40 rounded-xl border border-stone-800/60 text-xs text-stone-400 mb-6">
                    <span className="block text-[10px] uppercase tracking-wider mb-1 font-semibold text-stone-400">
                      Sample 200 m² Unit Estimate:
                    </span>
                    <strong className="font-mono text-stone-200 text-sm block">
                      {sampleMin} – {sampleMax} EGP
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave(pkg)}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
                    isSaved
                      ? "bg-emerald-500 text-stone-950"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950"
                  }`}
                >
                  {isSaving ? (
                    <span>Updating…</span>
                  ) : isSaved ? (
                    <span>✓ Rates Updated Successfully</span>
                  ) : (
                    <span>Save & Deploy Rates</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
