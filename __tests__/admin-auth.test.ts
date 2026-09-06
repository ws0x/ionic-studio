import { describe, it, expect } from "vitest";
import { checkAdminPassword, createSessionToken } from "@/lib/admin-auth";
import { POST as loginRoute } from "@/app/api/admin/auth/login/route";
import { POST as logoutRoute } from "@/app/api/admin/auth/logout/route";

describe("Admin Authentication Layer", () => {
  it("validates admin password with constant-time check", () => {
    expect(checkAdminPassword("ionic2026!")).toBe(true);
    expect(checkAdminPassword("wrong-pass")).toBe(false);
    expect(checkAdminPassword("")).toBe(false);
  });

  it("generates signed session token with 7-day expiry", () => {
    const token = createSessionToken();
    expect(token).toContain(".");
    const [payloadB64] = token.split(".");
    const data = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    expect(data.role).toBe("admin");
    expect(data.exp).toBeGreaterThan(Date.now());
  });

  it("rejects login with invalid password", async () => {
    const req = new Request("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "incorrect" }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("authenticates valid login and issues session cookie", async () => {
    const req = new Request("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "ionic2026!" }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("ionic_admin_session");
  });

  it("clears session cookie on logout", async () => {
    const res = await logoutRoute();
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("ionic_admin_session");
    expect(setCookie).toContain("Max-Age=0");
  });
});
