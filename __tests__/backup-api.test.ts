import { describe, it, expect, vi } from "vitest";
import { GET, POST } from "@/app/api/admin/backup/route";
import * as authModule from "@/lib/admin-auth";
import * as dbModule from "@/lib/db";
import { NextRequest } from "next/server";

describe("GET /api/admin/backup", () => {
  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(false);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("exports a valid JSON backup with attachment headers", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);
    vi.spyOn(dbModule, "getLeads").mockResolvedValueOnce([]);
    vi.spyOn(dbModule, "getContent").mockResolvedValueOnce({
      projects: [],
      packages: [],
      beforeAfter: [],
    });

    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Disposition")).toContain("attachment");

    const data = await res.json();
    expect(data.version).toBe("1.0");
    expect(data.data.leads).toEqual([]);
  });
});

describe("POST /api/admin/backup", () => {
  it("rejects unauthenticated requests with 401", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(false);
    const req = new NextRequest("http://localhost/api/admin/backup", {
      method: "POST",
      body: JSON.stringify({ action: "reset_to_factory" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects invalid action with 400", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);
    const req = new NextRequest("http://localhost/api/admin/backup", {
      method: "POST",
      body: JSON.stringify({ action: "unknown_action" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
