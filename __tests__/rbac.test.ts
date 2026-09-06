import { describe, it, expect } from "vitest";
import {
  validateUserCredentials,
  createSessionToken,
  parseAndVerifySessionToken,
  hasRouteAccess,
  ADMIN_USERS,
} from "@/lib/admin-auth";
import { POST as loginRoute } from "@/app/api/admin/auth/login/route";

describe("Role-Based Access Control (RBAC) Layer", () => {
  it("validates credentials correctly for each specific role", () => {
    // Super Admin / Director
    const adminUser = validateUserCredentials("admin", "ionic2026!");
    expect(adminUser).not.toBeNull();
    expect(adminUser?.role).toBe("super_admin");
    expect(adminUser?.username).toBe("admin");

    // Site Engineer
    const engineerUser = validateUserCredentials("engineer", "site2026!");
    expect(engineerUser).not.toBeNull();
    expect(engineerUser?.role).toBe("site_engineer");
    expect(engineerUser?.name).toContain("Tarek Mostafa");

    // Sales Representative
    const salesUser = validateUserCredentials("sales", "sales2026!");
    expect(salesUser).not.toBeNull();
    expect(salesUser?.role).toBe("sales_rep");
    expect(salesUser?.title).toBe("Finishing Consultant");

    // Invalid attempts
    expect(validateUserCredentials("engineer", "wrongpass")).toBeNull();
    expect(validateUserCredentials("unknown", "anypass")).toBeNull();
    expect(validateUserCredentials("admin", "")).toBeNull();
  });

  it("supports backward compatible login without explicit username", () => {
    const defaultUser = validateUserCredentials(undefined, "ionic2026!");
    expect(defaultUser).not.toBeNull();
    expect(defaultUser?.role).toBe("super_admin");
  });

  it("encodes and decodes role and identity into signed session token", () => {
    const engineerToken = createSessionToken({
      username: "engineer",
      name: "Tarek Mostafa",
      role: "site_engineer",
    });

    const parsed = parseAndVerifySessionToken(engineerToken);
    expect(parsed).not.toBeNull();
    expect(parsed?.role).toBe("site_engineer");
    expect(parsed?.username).toBe("engineer");
    expect(parsed?.name).toBe("Tarek Mostafa");
    expect(parsed?.exp).toBeGreaterThan(Date.now());
  });

  it("enforces strict route access policies per role", () => {
    // Super admin has unrestricted access
    expect(hasRouteAccess("super_admin", "/admin")).toBe(true);
    expect(hasRouteAccess("super_admin", "/admin/leads")).toBe(true);
    expect(hasRouteAccess("super_admin", "/admin/tracker")).toBe(true);
    expect(hasRouteAccess("super_admin", "/admin/packages")).toBe(true);

    // Site Engineer is restricted to tracker
    expect(hasRouteAccess("site_engineer", "/admin/tracker")).toBe(true);
    expect(hasRouteAccess("site_engineer", "/admin/tracker/edit")).toBe(true);
    expect(hasRouteAccess("site_engineer", "/admin/packages")).toBe(false);
    expect(hasRouteAccess("site_engineer", "/admin/leads")).toBe(false);
    expect(hasRouteAccess("site_engineer", "/admin")).toBe(false);

    // Sales Rep is restricted to leads
    expect(hasRouteAccess("sales_rep", "/admin/leads")).toBe(true);
    expect(hasRouteAccess("sales_rep", "/admin/leads/123")).toBe(true);
    expect(hasRouteAccess("sales_rep", "/admin/tracker")).toBe(false);
    expect(hasRouteAccess("sales_rep", "/admin/packages")).toBe(false);
  });

  it("authenticates via login API route with role and default destination", async () => {
    const req = new Request("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "engineer", password: "site2026!" }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("site_engineer");
    expect(data.user.defaultRoute).toBe("/admin/tracker");
    expect(data.user.name).toBe(ADMIN_USERS.engineer.name);

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("ionic_admin_session");
  });
});
