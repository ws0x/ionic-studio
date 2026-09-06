import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/track/[ref]/route";
import { NextRequest } from "next/server";

describe("GET /api/track/[ref]", () => {
  it("returns 200 with project data for valid seed reference", async () => {
    const req = new NextRequest("http://localhost/api/track/ION-7824");
    const params = Promise.resolve({ ref: "ION-7824" });

    const res = await GET(req, { params });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.project.referenceId).toBe("ION-7824");
    expect(data.project.clientName).toBe("Eng. Tarek Mansour");
    expect(data.project.overallProgress).toBeGreaterThanOrEqual(60);
    expect(data.project.milestones.length).toBe(5);
  });

  it("returns 404 for non-existent reference code", async () => {
    const req = new NextRequest("http://localhost/api/track/INVALID-9999");
    const params = Promise.resolve({ ref: "INVALID-9999" });

    const res = await GET(req, { params });
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toContain("No active project found");
  });
});
