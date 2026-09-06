"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ProjectTrackerView } from "@/components/tracker/ProjectTrackerView";
import type { ClientProject } from "@/lib/db";

function TrackPageContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const [query, setQuery] = useState(urlId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ClientProject | null>(null);

  const performSearch = async (refCode: string) => {
    const clean = refCode.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (locale === "ar"
              ? "لم يتم العثور على مشروع نشط بهذا الكود أو رقم الهاتف."
              : "No active project found with this code or phone number.")
        );
      }

      setProject(data.project);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving project";
      setError(msg);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!urlId || !urlId.trim()) return;

    let active = true;
    fetch(`/api/track/${encodeURIComponent(urlId.trim())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.project) {
          setProject(data.project);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [urlId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {project ? (
          <ProjectTrackerView
            project={project}
            onResetSearch={() => {
              setProject(null);
              setQuery("");
            }}
          />
        ) : (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            {/* Header */}
            <div className="space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                {locale === "ar" ? "بوابة العملاء الحصرية" : "Exclusive Client Portal"}
              </span>

              <h1 className="text-3xl sm:text-5xl font-light text-stone-100 tracking-tight">
                {locale === "ar" ? "تتبع مراحل تنفيذ مشروعك" : "Track Your Project Execution"}
              </h1>

              <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                {locale === "ar"
                  ? "أدخل كود المشروع المعتمد أو رقم الهاتف المسجل في التعاقد لمتابعة المخطط الزمني الهندسي وصور الموقع اليومية مباشرة."
                  : "Enter your verified project reference ID or contracted phone number to view live engineering milestones and site inspection photo feeds."}
              </p>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative max-w-lg mx-auto flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    locale === "ar"
                      ? "مثال: ION-7824 أو 01002345678"
                      : "e.g. ION-7824 or contracted phone number"
                  }
                  required
                  className="w-full py-4 ps-5 pe-32 rounded-2xl bg-stone-900/80 border border-stone-700 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 font-mono shadow-xl transition"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="absolute end-2 py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-50"
                >
                  {loading
                    ? locale === "ar"
                      ? "جاري البحث..."
                      : "Searching..."
                    : locale === "ar"
                    ? "تتبع الآن"
                    : "Track Now"}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl max-w-lg mx-auto">
                  {error}
                </div>
              )}
            </form>

            {/* Quick Demo Previews */}
            <div className="pt-4 space-y-2">
              <span className="text-xs text-stone-500 uppercase tracking-wider block">
                {locale === "ar" ? "أو جرّب مشاريع حية قيد التنفيذ:" : "Or explore active demo projects:"}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("ION-7824");
                    performSearch("ION-7824");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-400/40 text-stone-300 text-xs transition cursor-pointer font-mono"
                >
                  ION-7824 (Mountain View Villa)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("ION-9102");
                    performSearch("ION-9102");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-400/40 text-stone-300 text-xs transition cursor-pointer font-mono"
                >
                  ION-9102 (Palm Hills Penthouse)
                </button>
              </div>
            </div>

            {/* Quality and Privacy Trust Badges */}
            <div className="pt-8 border-t border-stone-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
              <div className="p-4 bg-stone-900/30 rounded-2xl border border-stone-800/40 space-y-1">
                <span className="text-amber-400 text-lg">🔒</span>
                <h4 className="text-xs font-semibold text-stone-200">
                  {locale === "ar" ? "خصوصية تامة" : "Private & Encrypted"}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {locale === "ar" ? "بياناتك محمية ومشفرة" : "Direct access for authorized clients"}
                </p>
              </div>

              <div className="p-4 bg-stone-900/30 rounded-2xl border border-stone-800/40 space-y-1">
                <span className="text-amber-400 text-lg">📷</span>
                <h4 className="text-xs font-semibold text-stone-200">
                  {locale === "ar" ? "توثيق فوتوغرافي" : "Daily Photo Logs"}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {locale === "ar" ? "صور مباشرة من المهندس المنفذ" : "High-resolution site captures"}
                </p>
              </div>

              <div className="p-4 bg-stone-900/30 rounded-2xl border border-stone-800/40 space-y-1">
                <span className="text-amber-400 text-lg">⚡</span>
                <h4 className="text-xs font-semibold text-stone-200">
                  {locale === "ar" ? "تواصل فوري" : "Direct Engineer Line"}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {locale === "ar" ? "خط مباشر مع مهندس موقعك" : "Instant WhatsApp and phone call"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TrackProjectPage() {
  return (
    <LocaleProvider>
      <Nav />
      <Suspense
        fallback={
          <div className="min-h-screen bg-stone-950 flex items-center justify-center text-xs text-stone-400">
            Loading project tracker...
          </div>
        }
      >
        <TrackPageContent />
      </Suspense>
      <Footer />
      <FloatingWhatsApp />
    </LocaleProvider>
  );
}
