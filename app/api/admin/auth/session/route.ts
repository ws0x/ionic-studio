import { NextResponse } from "next/server";
import { getAdminSession, ADMIN_USERS } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const userConfig = ADMIN_USERS[session.username];

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      name: session.name,
      role: session.role,
      title: userConfig?.title || "Studio Staff",
      titleAr: userConfig?.titleAr || "فريق العمل",
      allowedRoutes: userConfig?.allowedRoutes || ["/admin"],
    },
  });
}

