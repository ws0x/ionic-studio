import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/admin/analytics/route";
import * as authModule from "@/lib/admin-auth";
import * as dbModule from "@/lib/db";

describe("GET /api/admin/analytics", () => {
  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(false);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("calculates pipeline KPIs and stage distribution correctly", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const mockLeads: dbModule.Lead[] = [
      {
        id: "l1",
        referenceId: "ION-1",
        name: "Test Client 1",
        phone: "+201000000001",
        type: "apartment",
        stage: "finishing",
        area: "200 m²",
        city: "New Cairo",
        details: "Prestige package requested",
        status: "contract_signed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "l2",
        referenceId: "ION-2",
        name: "Test Client 2",
        phone: "+201000000002",
        type: "villa",
        stage: "construction",
        area: "350 m²",
        city: "Sheikh Zayed",
        details: "Opulence finishing",
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "l3",
        referenceId: "ION-3",
        name: "Test Client 3",
        phone: "+201000000003",
        type: "commercial",
        stage: "design",
        area: "100 m²",
        city: "Maadi",
        details: "Lost lead",
        status: "lost",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    vi.spyOn(dbModule, "getLeads").mockResolvedValueOnce(mockLeads);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.kpis.totalLeads).toBe(3);
    // 1 signed out of 3 = 33%
    expect(data.kpis.conversionRate).toBe(33);
    // 3 recent leads created today
    expect(data.kpis.recentLeadsCount).toBe(3);
    // Pipeline value should be positive (excluding lost lead l3)
    expect(data.kpis.totalPipelineValue).toBeGreaterThan(0);

    // Stage counts
    expect(data.stages.contract_signed).toBe(1);
    expect(data.stages.new).toBe(1);
    expect(data.stages.lost).toBe(1);
    expect(data.stages.contacted).toBe(0);

    // Space types
    expect(data.spaceTypes.apartment).toBe(1);
    expect(data.spaceTypes.villa).toBe(1);
  });
});
