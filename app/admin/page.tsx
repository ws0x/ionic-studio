"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/db";

interface AnalyticsData {
  kpis: {
    totalLeads: number;
    recentLeadsCount: number;
    conversionRate: number;
    totalPipelineValue: number;
    activeProjectsCount: number;
    showcasesCount: number;
    packagesCount: number;
  };
  stages: Record<LeadStatus, number>;
  spaceTypes: Record<string, number>;
  packageInterest: Record<string, number>;
  recentLeads: Lead[];
}

const STAGE_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "New Inquiries", color: "text-amber-400", bg: "bg-amber-400" },
  contacted: { label: "Contacted", color: "text-blue-400", bg: "bg-blue-400" },
  survey_scheduled: { label: "Survey Scheduled", color: "text-purple-400", bg: "bg-purple-400" },
  contract_signed: { label: "Contract Signed", color: "text-emerald-400", bg: "bg-emerald-400" },
  lost: { label: "Archived / Lost", color: "text-stone-500", bg: "bg-stone-500" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/analytics")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((result) => {
        if (active && result) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-400 text-xs uppercase tracking-widest">Loading Executive Intelligence...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { kpis, stages, spaceTypes, recentLeads } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Studio Intelligence Hub
          </span>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Executive Overview & Sales Funnel
          </h1>
          <p className="text-stone-400 text-xs mt-1.5">
            Real-time pipeline valuation, architectural inquiries, and project throughput across Egypt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/backup"
            download
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 border border-stone-700 hover:border-amber-400/50 text-stone-200 rounded-xl text-xs font-medium transition"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Full DB Backup
          </a>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-stone-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Total Inquiries</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-semibold text-stone-100 mb-1">{kpis.totalLeads}</div>
          <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <span className="text-amber-400 font-semibold">+{kpis.recentLeadsCount} new</span> in last 7 days
          </p>
        </div>

        {/* Card 2: Pipeline Valuation */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-stone-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Pipeline Valuation</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-semibold text-stone-100 mb-1">
            {(kpis.totalPipelineValue / 1_000_000).toFixed(1)}M <span className="text-sm font-normal text-stone-400">EGP</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Estimated gross contract value
          </p>
        </div>

        {/* Card 3: Win / Conversion Rate */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-stone-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Contract Rate</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-400/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-semibold text-stone-100 mb-1">{kpis.conversionRate}%</div>
          <p className="text-[11px] text-stone-400">
            {stages.contract_signed} signed contracts secured
          </p>
        </div>

        {/* Card 4: Content Inventory */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-stone-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Live Content</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-semibold text-stone-100 mb-1">
            {kpis.activeProjectsCount} <span className="text-xs font-normal text-stone-400">Projects</span>
          </div>
          <p className="text-[11px] text-stone-400">
            {kpis.showcasesCount} transformations · {kpis.packagesCount} packages
          </p>
        </div>
      </div>

      {/* CRM Funnel & Space Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel (2 Cols) */}
        <div className="lg:col-span-2 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-7">
          <h2 className="text-base font-medium text-stone-100 mb-1">Pipeline Conversion Funnel</h2>
          <p className="text-xs text-stone-400 mb-6">Distribution of inquiries across CRM pipeline stages.</p>

          <div className="space-y-4">
            {(Object.keys(stages) as LeadStatus[]).map((stageKey) => {
              const count = stages[stageKey];
              const pct = kpis.totalLeads > 0 ? Math.round((count / kpis.totalLeads) * 100) : 0;
              const cfg = STAGE_CONFIG[stageKey];

              return (
                <div key={stageKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                      {cfg.label}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cfg.bg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Space Type Distribution (1 Col) */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-medium text-stone-100 mb-1">Property Type Demand</h2>
            <p className="text-xs text-stone-400 mb-6">Inquiries categorized by architectural classification.</p>

            <div className="space-y-3">
              {Object.entries(spaceTypes).map(([type, count]) => {
                const pct = kpis.totalLeads > 0 ? Math.round((count / kpis.totalLeads) * 100) : 0;
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-stone-950/60 border border-stone-800 rounded-xl">
                    <span className="text-xs capitalize font-medium text-stone-200">{type}</span>
                    <span className="text-xs font-mono text-amber-400 font-semibold">{count} leads ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800/80 mt-6">
            <Link
              href="/admin/leads"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              Open Full CRM Pipeline →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Leads Preview */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-stone-100">Latest Inquiries</h2>
          <Link href="/admin/leads" className="text-xs text-amber-400 hover:underline">
            View all {kpis.totalLeads} leads
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">Client</th>
                <th className="p-3">Type & Area</th>
                <th className="p-3">City</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {recentLeads.map((l) => {
                const cfg = STAGE_CONFIG[l.status] || STAGE_CONFIG.new;
                return (
                  <tr key={l.id} className="hover:bg-stone-800/30 transition">
                    <td className="p-3 font-mono text-amber-400/90">{l.referenceId}</td>
                    <td className="p-3 font-medium text-stone-100">{l.name}</td>
                    <td className="p-3 capitalize">{l.type} · {l.area || "180 m²"}</td>
                    <td className="p-3">{l.city || "Cairo"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.color} border-current/20 bg-stone-950`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
