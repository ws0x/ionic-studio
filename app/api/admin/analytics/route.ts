import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getLeads, getContent, type LeadStatus } from "@/lib/db";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [leads, content] = await Promise.all([getLeads(), getContent()]);

    const totalLeads = leads.length;

    // 1. Stage Distribution
    const stageCounts: Record<LeadStatus, number> = {
      new: 0,
      contacted: 0,
      survey_scheduled: 0,
      contract_signed: 0,
      lost: 0,
    };

    leads.forEach((l) => {
      if (stageCounts[l.status] !== undefined) {
        stageCounts[l.status]++;
      } else {
        stageCounts.new++;
      }
    });

    const conversionRate =
      totalLeads > 0
        ? Math.round((stageCounts.contract_signed / totalLeads) * 100)
        : 0;

    // 2. Velocity: Leads within last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentLeadsCount = leads.filter((l) => {
      const created = new Date(l.createdAt).getTime();
      return !isNaN(created) && created >= sevenDaysAgo;
    }).length;

    // 3. Estimated Pipeline Valuation (EGP)
    // Estimate each lead: parse numeric area (default 180 m²) * average package rate (default 14,000 EGP/m²)
    const avgRatePerMeter =
      content.packages.length > 0
        ? Math.round(
            content.packages.reduce((acc, p) => acc + (p.minRate + p.maxRate) / 2, 0) /
              content.packages.length
          )
        : 14000;

    let totalPipelineValue = 0;
    leads.forEach((l) => {
      const match = (l.area || "").match(/\d+/);
      const parsedArea = match ? parseInt(match[0], 10) : 180;
      // Pipeline only counts active (non-lost) leads
      if (l.status !== "lost") {
        totalPipelineValue += parsedArea * avgRatePerMeter;
      }
    });

    // 4. Space Type Breakdown
    const spaceTypeCounts: Record<string, number> = {};
    leads.forEach((l) => {
      const type = l.type || "residential";
      spaceTypeCounts[type] = (spaceTypeCounts[type] || 0) + 1;
    });

    // 5. Package Counts (from details or notes)
    const packageInterest: Record<string, number> = {
      essential: 0,
      prestige: 0,
      opulence: 0,
      custom: 0,
    };

    leads.forEach((l) => {
      const text = `${l.details || ""} ${l.stage || ""}`.toLowerCase();
      if (text.includes("opulence") || text.includes("أوبولنس") || text.includes("فاخر")) {
        packageInterest.opulence++;
      } else if (text.includes("essential") || text.includes("إيسنشال") || text.includes("أساسي")) {
        packageInterest.essential++;
      } else if (text.includes("prestige") || text.includes("بريستيج") || text.includes("مميز")) {
        packageInterest.prestige++;
      } else {
        packageInterest.custom++;
      }
    });

    return NextResponse.json({
      kpis: {
        totalLeads,
        recentLeadsCount,
        conversionRate,
        totalPipelineValue,
        activeProjectsCount: content.projects.length,
        showcasesCount: content.beforeAfter.length,
        packagesCount: content.packages.length,
      },
      stages: stageCounts,
      spaceTypes: spaceTypeCounts,
      packageInterest,
      recentLeads: leads.slice(0, 5),
    });
  } catch (err) {
    console.error("Analytics aggregation error:", err);
    return NextResponse.json(
      { error: "Failed to generate analytics data" },
      { status: 500 }
    );
  }
}
