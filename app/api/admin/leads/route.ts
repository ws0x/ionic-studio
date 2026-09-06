import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getLeads } from "@/lib/db";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads });
}
