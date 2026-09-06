import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getDbProjects, addDbProject } from "@/lib/db";
import type { Project } from "@/lib/content";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const projects = await getDbProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Project;

    if (!body.title?.en || !body.title?.ar || !body.image) {
      return NextResponse.json(
        { error: "Bilingual titles and image URL are required." },
        { status: 400 }
      );
    }

    const created = await addDbProject(body);
    return NextResponse.json({ success: true, project: created });
  } catch (err) {
    console.error("Failed to add project:", err);
    return NextResponse.json({ error: "Failed to add project." }, { status: 500 });
  }
}
