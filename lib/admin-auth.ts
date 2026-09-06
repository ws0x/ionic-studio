import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ionic_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "ionic-studio-secure-secret-salt-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ionic2026!";
const ENGINEER_PASSWORD = process.env.ENGINEER_PASSWORD || "site2026!";
const SALES_PASSWORD = process.env.SALES_PASSWORD || "sales2026!";

export type AdminRole = "super_admin" | "admin" | "site_engineer" | "sales_rep";

export interface AdminUser {
  username: string;
  name: string;
  role: AdminRole;
  title: string;
  titleAr: string;
  allowedRoutes: string[];
}

export interface SessionData {
  username: string;
  name: string;
  role: AdminRole;
  exp: number;
}

export const ADMIN_USERS: Record<string, AdminUser & { getPassword: () => string }> = {
  admin: {
    username: "admin",
    name: "Studio Director",
    role: "super_admin",
    title: "Executive Director",
    titleAr: "المدير التنفيذي",
    allowedRoutes: ["/admin", "/admin/leads", "/admin/packages", "/admin/projects", "/admin/before-after", "/admin/tracker"],
    getPassword: () => ADMIN_PASSWORD,
  },
  engineer: {
    username: "engineer",
    name: "Tarek Mostafa (Lead Engineer)",
    role: "site_engineer",
    title: "Senior Site Engineer",
    titleAr: "مهندس الموقع التنفيذي",
    allowedRoutes: ["/admin/tracker"],
    getPassword: () => ENGINEER_PASSWORD,
  },
  sales: {
    username: "sales",
    name: "Nouran El-Shamy (Sales)",
    role: "sales_rep",
    title: "Finishing Consultant",
    titleAr: "مستشار التشطيب والتعاقدات",
    allowedRoutes: ["/admin/leads"],
    getPassword: () => SALES_PASSWORD,
  },
};

function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function parseAndVerifySessionToken(token: string): SessionData | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const hmac = crypto.createHmac("sha256", SESSION_SECRET);
    hmac.update(payload);
    const expectedSig = hmac.digest("hex");

    if (
      signature.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
    ) {
      return null;
    }

    const data = JSON.parse(payload) as { username?: string; name?: string; role: AdminRole; exp: number };
    if (!data.role || !data.exp || data.exp <= Date.now()) {
      return null;
    }

    const role = data.role;
    const username = data.username || (role === "site_engineer" ? "engineer" : role === "sales_rep" ? "sales" : "admin");
    const name = data.name || (ADMIN_USERS[username]?.name ?? "Studio Staff");

    return {
      username,
      name,
      role,
      exp: data.exp,
    };
  } catch {
    return null;
  }
}

function verifyToken(token: string): boolean {
  return parseAndVerifySessionToken(token) !== null;
}

function constantTimeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkAdminPassword(password: string): boolean {
  return constantTimeCompare(password, ADMIN_PASSWORD);
}

export function validateUserCredentials(username?: string, password?: string): AdminUser | null {
  if (!password) return null;

  // Backward compatibility: If no username provided, check against default admin password
  if (!username) {
    if (constantTimeCompare(password, ADMIN_PASSWORD)) {
      return ADMIN_USERS.admin;
    }
    // Check if password matches any configured user
    for (const user of Object.values(ADMIN_USERS)) {
      if (constantTimeCompare(password, user.getPassword())) {
        return user;
      }
    }
    return null;
  }

  const user = ADMIN_USERS[username.toLowerCase().trim()];
  if (!user) return null;

  if (constantTimeCompare(password, user.getPassword())) {
    return user;
  }
  return null;
}

export function createSessionToken(user?: { username?: string; name?: string; role?: AdminRole }): string {
  const role: AdminRole = user?.role || "admin";
  const username = user?.username || (role === "site_engineer" ? "engineer" : role === "sales_rep" ? "sales" : "admin");
  const name = user?.name || (ADMIN_USERS[username]?.name ?? "Studio Staff");

  const payload = JSON.stringify({
    username,
    name,
    role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return signToken(payload);
}

export async function getAdminSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseAndVerifySessionToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function hasRouteAccess(role: AdminRole, route: string): boolean {
  if (role === "super_admin" || role === "admin") return true;
  if (role === "site_engineer") {
    return route === "/admin/tracker" || route.startsWith("/admin/tracker");
  }
  if (role === "sales_rep") {
    return route === "/admin/leads" || route.startsWith("/admin/leads");
  }
  return false;
}

export async function verifyRoleAuthorization(
  allowedRoles: AdminRole[]
): Promise<{ authorized: boolean; status: number; error?: string; user?: SessionData }> {
  const session = await getAdminSession();
  if (!session) {
    const authed = await isAuthenticated();
    if (!authed) {
      return { authorized: false, status: 401, error: "Unauthorized." };
    }
    return {
      authorized: true,
      status: 200,
      user: {
        username: "admin",
        name: "Studio Director",
        role: "super_admin",
        exp: Date.now() + 86400000,
      },
    };
  }

  const isRoleAllowed =
    allowedRoles.includes(session.role) ||
    (session.role === "admin" && allowedRoles.includes("super_admin")) ||
    session.role === "super_admin";

  if (!isRoleAllowed) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Insufficient role permissions for this operation.",
    };
  }

  return { authorized: true, status: 200, user: session };
}

export { SESSION_COOKIE_NAME };

