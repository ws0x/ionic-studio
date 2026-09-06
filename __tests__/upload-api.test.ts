import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/admin/upload/route";
import * as authModule from "@/lib/admin-auth";
import { NextRequest } from "next/server";

describe("POST /api/admin/upload", () => {
  it("rejects unauthorized requests with 401", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(false);

    const req = new NextRequest("http://localhost/api/admin/upload", {
      method: "POST",
    });

    const res= await POST(req);
    expect(res.status).toBe(401);
  });

it("rejects missing file with 400", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const formData = new FormData();
    const req = new NextRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects disallowed MIME types with 400", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const formData = new FormData();
    const blob = new Blob(["executable script"], { type: "application/x-msdos-program" });
    formData.append("file", blob, "malware.exe");

    const req = new NextRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid file type");
  });

  it("successfully processes and saves a valid PNG image", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValueOnce(true);

    const formData = new FormData();
    const blob = new Blob([beforePngBuffer], { type: "image/png" });
    formData.append("file", blob, "photo.png");

    const req = new NextRequest("http://localhost/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.url).match(/^\/uploads\/upload_/);
    expect(data.mimeType).toBe("image/png");
  });
});

const beforePngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

