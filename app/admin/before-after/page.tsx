"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { BeforeAfterShowcase } from "@/lib/content";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminBeforeAfterPage() {
  const [cases, setCases] = useState<BeforeAfterShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form fields
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [compoundEn, setCompoundEn] = useState("");
  const [compoundAr, setCompoundAr] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [durationEn, setDurationEn] = useState("90 Days");
  const [durationAr, setDurationAr] = useState("٩٠ يوم");
  const [scopeEn, setScopeEn] = useState("");
  const [scopeAr, setScopeAr] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/before-after")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ beforeAfter: [] })))
      .then((data) => {
        if (active) {
          setCases(data.beforeAfter || []);
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

  const handleCreateShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImage || !afterImage) {
      alert("Please provide both Before and After images.");
      return;
    }

    setSubmitting(true);
    const newShowcase: BeforeAfterShowcase = {
      id: `showcase_${Date.now()}`,
      title: { ar: titleAr, en: titleEn },
      compound: { ar: compoundAr || "مشروع خاص", en: compoundEn || "Private Compound" },
      location: { ar: locationAr || "القاهرة", en: locationEn || "Cairo" },
      duration: { ar: durationAr, en: durationEn },
      scope: { ar: scopeAr || "تشطيب كامل", en: scopeEn || "Full Turnkey Fit-out" },
      beforeImage,
      afterImage,
    };

    try {
      const res = await fetch("/api/admin/before-after", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShowcase),
      });

      if (res.ok) {
        const data = await res.json();
        setCases((prev) => [data.showcase, ...prev]);
        setIsAdding(false);
        setTitleEn("");
        setTitleAr("");
        setCompoundEn("");
        setCompoundAr("");
        setLocationEn("");
        setLocationAr("");
        setScopeEn("");
        setScopeAr("");
        setBeforeImage("");
        setAfterImage("");
      } else {
        alert("Failed to create showcase");
      }
    } catch {
      alert("Network error creating showcase");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Visual Craftsmanship Proof
          </span>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Before & After Renovation Showcases
          </h1>
          <p className="text-stone-400 text-xs mt-1.5 max-w-2xl">
            Visual documentation of units transforming from raw core & shell / red brick into turnkey luxury spaces.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/10 transition shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Showcase
        </button>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h2 className="text-lg font-medium text-stone-100">Add Transformation Showcase</h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-stone-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShowcase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Title (English)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mountain View Villa Living"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Title (Arabic)</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: فيلا ماونتن فيو - منطقة المعيشة"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Compound / Project (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mivida"
                    value={compoundEn}
                    onChange={(e) => setCompoundEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Compound / Project (AR)</label>
                  <input
                    type="text"
                    placeholder="مثال: ميفيدا"
                    value={compoundAr}
                    onChange={(e) => setCompoundAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Location (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. New Cairo"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Location (AR)</label>
                  <input
                    type="text"
                    placeholder="مثال: القاهرة الجديدة"
                    value={locationAr}
                    onChange={(e) => setLocationAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Duration (EN)</label>
                  <input
                    type="text"
                    value={durationEn}
                    onChange={(e) => setDurationEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Duration (AR)</label>
                  <input
                    type="text"
                    value={durationAr}
                    onChange={(e) => setDurationAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Scope of Work (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Demolition, MEP rough-ins, microcement, custom oak woodwork"
                    value={scopeEn}
                    onChange={(e) => setScopeEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Scope of Work (AR)</label>
                  <input
                    type="text"
                    placeholder="مثال: أعمال التكسير، تأسيس كهروميكانيك، أرضيات مايكروسمنت وتجليد أخشاب أرو"
                    value={scopeAr}
                    onChange={(e) => setScopeAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
              </div>

              {/* Dual Image Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <ImageUploader
                  label="Before Image (Raw / Red Brick)"
                  value={beforeImage}
                  onChange={setBeforeImage}
                  required
                />
                <ImageUploader
                  label="After Image (Turnkey Handover)"
                  value={afterImage}
                  onChange={setAfterImage}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs cursor-pointer hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg text-xs cursor-pointer hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-stone-400 text-sm">
          Loading showcases…
        </div>
      ) : (
        <div className="space-y-8">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
                    {c.compound.en} · {c.location.en}
                  </span>
                  <h2 className="text-xl font-medium text-stone-100 mt-1">
                    {c.title.en} ({c.title.ar})
                  </h2>
                </div>
                <div className="px-3 py-1 bg-stone-950 border border-stone-700 rounded-lg text-xs font-mono text-stone-300">
                  ⏱ Timeline: {c.duration.en}
                </div>
              </div>

              {/* Side-by-Side Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                  <Image
                    src={c.beforeImage}
                    alt={`${c.title.en} - Before`}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded bg-stone-950/90 text-stone-300 text-[10px] uppercase font-bold border border-stone-700">
                    Phase 1: Core & Shell
                  </span>
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-amber-500/30 bg-stone-950">
                  <Image
                    src={c.afterImage}
                    alt={`${c.title.en} - After`}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 end-3 px-2.5 py-1 rounded bg-amber-500 text-stone-950 text-[10px] uppercase font-bold shadow-lg">
                    Turnkey Handover
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400">
                <strong className="text-stone-300 font-medium">Scope: </strong>
                {c.scope.en} ({c.scope.ar})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
