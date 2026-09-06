import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/content/route";
import * as dbModule from "@/lib/db";

describe("GET /api/content", () => {
  it("returns 200 with projects, packages, and beforeAfter", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(Array.isArray(data.packages)).toBe(true);
    expect(Array.isArray(data.beforeAfter)).toBe(true);
    expect(data.projects.length).toBeGreaterThan(0);
    expect(data.packages.length).toBeGreaterThan(0);
    expect(data.beforeAfter.length).toBeGreaterThan(0);

    expect(response.headers.get("Cache-Control")).toContain("s-maxage=60");
  });

  it("handles repository failure gracefully with fallback content", async () => {
    const spy = vi.spyOn(dbModule, "getContent").mockRejectedValueOnce(new Error("FS Failure"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(response.headers.get("Cache-Control")).toBe("no-cache");

    spy.mockRestore();
    consoleSpy.mockRestore();
  });
});
