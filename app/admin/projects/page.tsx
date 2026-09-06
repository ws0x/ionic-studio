"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Project } from "@/lib/content";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [categoryKey, setCategoryKey] = useState<Project["categoryKey"]>("residential");
  const [locationEn, setLocationEn] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [area, setArea] = useState("");
  const [year, setYear] = useState("2026");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/projects")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ projects: [] })))
      .then((data) => {
        if (active) {
          setProjects(data.projects || []);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: Project = {
      title: { ar: titleAr, en: titleEn },
      desc: { ar: descAr || titleAr, en: descEn || titleEn },
      category: {
        ar: categoryKey === "residential" ? "سكني" : categoryKey === "commercial" ? "تجاري" : "مكاتب",
        en: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
      },
      categoryKey,
      location: { ar: locationAr, en: locationEn },
      area: area ? `${area} m²` : undefined,
      year,
      image: imageUrl,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj),
      });

      if (res.ok) {
        setProjects((prev) => [newProj, ...prev]);
        setIsAdding(false);
        // Reset form
        setTitleEn("");
        setTitleAr("");
        setDescEn("");
        setDescAr("");
        setLocationEn("");
        setLocationAr("");
        setImageUrl("");
        setArea("");
        setYear("2026");
      }
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Portfolio Curation
          </span>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Architectural Projects Portfolio
          </h1>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{isAdding ? "Cancel" : "Add New Project"}</span>
        </button>
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <form onSubmit={handleCreateProject} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4 animate-in fade-in duration-150">
          <h2 className="text-lg font-light text-stone-100 mb-2">
            Publish New Landmark Project
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Title (English)</label>
              <input
                required
                type="text"
                placeholder="e.g. Mivida Modern Villa"
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
                placeholder="مثال: فيلا ميفيدا المعاصرة"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Description (English)</label>
              <input
                type="text"
                placeholder="Luxury villa with contemporary interiors…"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Description (Arabic)</label>
              <input
                type="text"
                placeholder="فيلا سكنية بتصميم داخلي معاصر…"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Category</label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value as Project["categoryKey"])}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
              >
                <option value="residential">Residential (سكني)</option>
                <option value="commercial">Commercial (تجاري)</option>
                <option value="office">Corporate Office (إداري)</option>
                <option value="hospitality">Hospitality (ضيافة)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Area (m²)</label>
              <input
                type="text"
                placeholder="e.g. 550"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Location (English)</label>
              <input
                required
                type="text"
                placeholder="e.g. New Cairo"
                value={locationEn}
                onChange={(e) => setLocationEn(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Location (Arabic)</label>
              <input
                required
                type="text"
                placeholder="مثال: القاهرة الجديدة"
                value={locationAr}
                onChange={(e) => setLocationAr(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Year</label>
              <input
                type="text"
                placeholder="e.g. 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploader
                label="High-Res Cover Image"
                value={imageUrl}
                onChange={setImageUrl}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg text-xs transition"
            >
              Publish to Portfolio
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-400 text-sm">
          Loading portfolio projects…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full bg-stone-950">
                <Image
                  src={proj.image}
                  alt={proj.title.en}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <span className="absolute top-3 end-3 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-200 text-[10px] font-semibold uppercase">
                  {proj.category.en}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-medium text-stone-100 mb-1">
                  {proj.title.en}
                </h3>
                <span className="text-xs text-amber-400/90 block mb-3">
                  📍 {proj.location.en} · {proj.area || "Custom"}
                </span>
                <p className="text-xs text-stone-400 line-clamp-2">
                  {proj.desc.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
