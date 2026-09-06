import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getDbBeforeAfter, addDbBeforeAfter } from "@/lib/db";
import type { BeforeAfterShowcase } from "@/lib/content";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const beforeAfter = await getDbBeforeAfter();
  return NextResponse.json({ beforeAfter });
}

export async function POST(req: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<BeforeAfterShowcase>;
    if (
      !body.title?.en ||
      !body.title?.ar ||
      !body.beforeImage ||
      !body.afterImage
    ) {
      return NextResponse.json(
        { error: "Title, beforeImage, and afterImage are required." },
        { status: 400 }
      );
    }

    const newShowcase: BeforeAfterShowcase = {
      id: body.id || `showcase_${Date.now()}`,
      title: body.title,
      compound: body.compound || { ar: "مشروع خاص", en: "Private Project" },
      location: body.location || { ar: "القاهرة", en: "Cairo" },
      duration: body.duration || { ar: "٩٠ يوم", en: "90 Days" },
      scope: body.scope || { ar: "تشطيب كامل", en: "Full Turnkey Fit-out" },
      beforeImage: body.beforeImage,
      afterImage: body.afterImage,
    };

    const created = await addDbBeforeAfter(newShowcase);
    return NextResponse.json({ showcase: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to add before/after showcase:", error);
    return NextResponse.json(
      { error: "Failed to create showcase." },
      { status: 500 }
    );
  }
}
