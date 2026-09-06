import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/admin/tracker/route";
import { PATCH, POST as POST_UPDATE } from "@/app/api/admin/tracker/[id]/route";
import * as authModule from "@/lib/admin-auth";
import { NextRequest } from "next/server";

describe("Admin Tracker API Routes", () => {
  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(false);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("lists all tracked projects for authenticated admin", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThanOrEqual(1);
  });

  it("updates project milestone progress via PATCH /api/admin/tracker/[id]", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const req = new NextRequest("http://localhost/api/admin/tracker/ION-7824", {
      method: "PATCH",
      body: JSON.stringify({ overallProgress: 72 }),
    });
    const params = Promise.resolve({ id: "ION-7824" });

    const res = await PATCH(req, { params });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.project.overallProgress).toBe(72);
  });

  it("posts a new site update with photo via POST /api/admin/tracker/[id]", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const req = new NextRequest("http://localhost/api/admin/tracker/ION-7824", {
      method: "POST",
      body: JSON.stringify({
        date: "2026-03-05",
        title: { ar: "تقرير جديد", en: "New Plaster Inspection" },
        notes: { ar: "تم الفحص", en: "Walls passed laser alignment checks" },
        imageUrl: "/uploads/site_test.jpg",
        phase: "civil_plaster",
        engineerName: "Eng. Ahmed",
      }),
    });
    const params = Promise.resolve({ id: "ION-7824" });

    const res = await POST_UPDATE(req, { params });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.update.title.en).toBe("New Plaster Inspection");
  });
});
