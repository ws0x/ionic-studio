import { NextResponse } from "next/server";
import { validateUserCredentials, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim();
    const password = body.password?.trim() || "";

    const user = validateUserCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or unauthorized role access." },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      username: user.username,
      name: user.name,
      role: user.role,
    });

    const defaultRoute = user.role === "site_engineer" 
      ? "/admin/tracker" 
      : user.role === "sales_rep" 
      ? "/admin/leads" 
      : "/admin";

    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        title: user.title,
        titleAr: user.titleAr,
        defaultRoute,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

