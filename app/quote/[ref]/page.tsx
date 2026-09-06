"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { finishingPackages } from "@/lib/content";
import type { ClientProject } from "@/lib/db";

interface QuotePageProps {
  params: Promise<{ ref: string }>;
}

export default function BrandedQuotePage({ params }: QuotePageProps) {
  const resolvedParams = use(params);
  const refCode = resolvedParams.ref;

  const [project, setProject] = useState<ClientProject | null>(null);

  // If refCode is a package key like "prestige-200m2", or a real project ref like "ION-7824"
  useEffect(() => {
    let active = true;
    fetch(`/api/track/${encodeURIComponent(refCode)}`)
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
  }, [refCode]);

  // Derived calculation
  let packageName = "Prestige Tier";
  let packageRate = 13500;
  let areaM2 = 180;
  let clientName = "Prospective Client";
  let location = "New Cairo, Egypt";
  let refId = refCode.toUpperCase();

  if (project) {
    clientName = project.clientName;
    location = `${project.compound.en}, ${project.city.en}`;
    const areaMatch = project.area.match(/\d+/);
    if (areaMatch) areaM2 = parseInt(areaMatch[0], 10);
    refId = project.referenceId;
  } else {
    // Parse from URL e.g. "opulence-250m2" or "ION-PRESTIGE-180"
    const lower = refCode.toLowerCase();
    const pkg = finishingPackages.find((p) => lower.includes(p.id)) || finishingPackages[1];
    packageName = pkg.name.en;
    packageRate = Math.round((pkg.minRate + pkg.maxRate) / 2);

    const m2Match = refCode.match(/(\d+)/);
    if (m2Match) {
      areaM2 = parseInt(m2Match[1], 10);
    }
  }

  const estimatedTotal = areaM2 * packageRate;
  const milestone1 = Math.round(estimatedTotal * 0.4); // 40%
  const milestone2 = Math.round(estimatedTotal * 0.3); // 30%
  const milestone3 = Math.round(estimatedTotal * 0.2); // 20%
  const milestone4 = Math.round(estimatedTotal * 0.1); // 10%

  const issueDateStr = project?.contractDate || "2026-03-05";
  const quoteDate = new Date(issueDateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const expiryTime = new Date(issueDateStr).getTime() + 14 * 24 * 60 * 60 * 1000;
  const validUntilDate = new Date(expiryTime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 py-10 px-4 sm:px-6 print:bg-white print:text-stone-900 print:p-0 print:m-0">
      {/* Action Toolbar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-200 transition"
        >
          ← Return to Studio
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/track?id=${encodeURIComponent(refId)}`}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition"
          >
            Open Project Tracker ↗
          </Link>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save as Official PDF
          </button>
        </div>
      </div>

      {/* Official Specification Sheet Document Canvas */}
      <div className="max-w-4xl mx-auto bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-10 relative overflow-hidden print:border-none print:shadow-none print:p-8 print:bg-white print:text-stone-950 print:rounded-none">
        {/* Header with Studio Crest */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-stone-800 print:border-stone-300 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold font-serif text-lg print:border-stone-900 print:text-stone-900">
                I
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-stone-100 print:text-stone-950 uppercase font-serif">
                  Ionic Design House
                </h1>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold print:text-stone-600">
                  Architectural Interior & Finishing Bureau · Cairo, Egypt
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 print:text-stone-600 max-w-sm mt-2">
              Commercial Registration: 184920 · Tax ID: 629-411-980
              <br />
              Plot 48, South Investors Area, New Cairo, Egypt
            </p>
          </div>

          <div className="text-start sm:text-end space-y-1 font-mono text-xs text-stone-400 print:text-stone-700">
            <div className="text-sm font-bold text-amber-300 print:text-stone-950">
              SPEC-QUOTE #{refId}
            </div>
            <div>Date of Issue: {quoteDate}</div>
            <div className="text-stone-500 print:text-stone-600">Price Lock Valid Until: {validUntilDate}</div>
          </div>
        </div>

        {/* Client & Project Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-stone-900/50 border border-stone-800/80 print:bg-stone-50 print:border-stone-200">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 print:text-stone-600 font-semibold block">
              Contracting Principal
            </span>
            <h3 className="text-base font-semibold text-stone-100 print:text-stone-950">{clientName}</h3>
            <p className="text-xs text-stone-400 print:text-stone-700">{location}</p>
          </div>

          <div className="space-y-1 sm:text-end">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 print:text-stone-600 font-semibold block">
              Finishing Package & Scale
            </span>
            <h3 className="text-base font-semibold text-amber-300 print:text-stone-950 font-serif">
              {packageName}
            </h3>
            <p className="text-xs text-stone-400 print:text-stone-700 font-mono">
              Net Covered Area: {areaM2} m² @ ~{packageRate.toLocaleString()} EGP/m²
            </p>
          </div>
        </div>

        {/* Itemized Finishes Scope */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-amber-400 print:text-stone-950 font-bold border-b border-stone-800 print:border-stone-200 pb-2">
            Itemized Architectural Scope of Work
          </h3>

          <div className="divide-y divide-stone-800/60 print:divide-stone-200 text-xs">
            <div className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-200 print:text-stone-950 block">
                  1. Civil, Masonry & Wet Area Waterproofing
                </span>
                <p className="text-stone-400 print:text-stone-600 text-[11px]">
                  Internal layout restructuring, fiber-reinforced mechanical plaster, double cementitious membrane bathroom & terrace waterproofing with 48-hour standing water pressure test.
                </p>
              </div>
              <span className="font-mono text-stone-400 print:text-stone-700 shrink-0">Included</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-200 print:text-stone-950 block">
                  2. Concealed MEP & Low-Voltage Automation Infrastructure
                </span>
                <p className="text-stone-400 print:text-stone-600 text-[11px]">
                  PEX concealed water manifold network, acoustic-insulated drainage conduits, concealed copper AC lines, and KNX/Smart automation conduits routed to central enclosure.
                </p>
              </div>
              <span className="font-mono text-stone-400 print:text-stone-700 shrink-0">Included</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-200 print:text-stone-950 block">
                  3. Premium Flooring & Architectural Ceilings
                </span>
                <p className="text-stone-400 print:text-stone-600 text-[11px]">
                  Spanish / Italian rectified porcelain or imported marble in reception; high-traffic engineered hardwood in bedrooms; Knauf water-resistant suspended gypsum ceilings with shadow-gap details.
                </p>
              </div>
              <span className="font-mono text-stone-400 print:text-stone-700 shrink-0">Included</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-200 print:text-stone-950 block">
                  4. Custom Woodwork, Flush Doors & Sanitary Fixtures
                </span>
                <p className="text-stone-400 print:text-stone-600 text-[11px]">
                  2.6m floor-to-ceiling concealed hinge interior doors with magnetic locks; Grohe / Duravit concealed cisterns with matte black / brushed nickel thermostatic fixtures.
                </p>
              </div>
              <span className="font-mono text-stone-400 print:text-stone-700 shrink-0">Included</span>
            </div>
          </div>
        </div>

        {/* Budget Summary & Milestone Payment Schedule */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-amber-400 print:text-stone-950 font-bold border-b border-stone-800 print:border-stone-200 pb-2">
            Commercial Summary & Milestone Payment Schedule
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 print:bg-stone-50 print:border-stone-200">
              <span className="text-[10px] uppercase text-stone-400 print:text-stone-600 font-semibold block">
                1. Advance Signing (40%)
              </span>
              <div className="text-sm font-bold font-mono text-stone-100 print:text-stone-950 mt-1">
                {milestone1.toLocaleString()} <span className="text-[10px] font-normal">EGP</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Procurement & mobilization</p>
            </div>

            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 print:bg-stone-50 print:border-stone-200">
              <span className="text-[10px] uppercase text-stone-400 print:text-stone-600 font-semibold block">
                2. MEP Signoff (30%)
              </span>
              <div className="text-sm font-bold font-mono text-stone-100 print:text-stone-950 mt-1">
                {milestone2.toLocaleString()} <span className="text-[10px] font-normal">EGP</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Electrical, HVAC & plaster</p>
            </div>

            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 print:bg-stone-50 print:border-stone-200">
              <span className="text-[10px] uppercase text-stone-400 print:text-stone-600 font-semibold block">
                3. Finishes Handover (20%)
              </span>
              <div className="text-sm font-bold font-mono text-stone-100 print:text-stone-950 mt-1">
                {milestone3.toLocaleString()} <span className="text-[10px] font-normal">EGP</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Flooring & woodwork</p>
            </div>

            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 print:bg-stone-50 print:border-stone-200">
              <span className="text-[10px] uppercase text-stone-400 print:text-stone-600 font-semibold block">
                4. Key Handover (10%)
              </span>
              <div className="text-sm font-bold font-mono text-emerald-400 print:text-stone-950 mt-1">
                {milestone4.toLocaleString()} <span className="text-[10px] font-normal">EGP</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Snagging & warranty certificate</p>
            </div>
          </div>

          <div className="flex items-baseline justify-between p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl print:bg-stone-100 print:border-stone-400">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 print:text-stone-950 font-bold block">
                Total Estimated Turnkey Contract Value
              </span>
              <span className="text-[11px] text-stone-400 print:text-stone-600">
                Includes all architectural supervision, materials, logistics & Egyptian building code compliance
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 print:text-stone-950">
              {estimatedTotal.toLocaleString()} <span className="text-xs font-normal">EGP</span>
            </div>
          </div>
        </div>

        {/* Legal Signatures & Verification */}
        <div className="pt-6 border-t border-stone-800 print:border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-400 print:text-stone-700">
          <div className="space-y-1">
            <span className="font-semibold text-stone-300 print:text-stone-900 block">Authorized Engineering Bureau Seal</span>
            <p className="text-[11px] max-w-sm">
              This quotation constitutes an official preliminary specification sheet. Formal execution agreement will be signed upon engineering site survey.
            </p>
          </div>

          <div className="flex items-center gap-6 sm:text-end">
            <div>
              <span className="font-mono text-amber-400 print:text-stone-950 block font-bold text-sm">
                IONIC DESIGN HOUSE
              </span>
              <span className="text-[10px] text-stone-500 block">Technical Directorate, Cairo</span>
            </div>

            <div className="w-16 h-16 bg-stone-900 border border-stone-700 rounded-xl flex items-center justify-center text-[9px] font-mono text-stone-500 p-1 text-center print:border-stone-400 print:text-stone-900">
              QR VERIFIED CODE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
