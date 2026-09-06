import { NextRequest, NextResponse } from "next/server";
import { getClientProjectByRef } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    if (!ref || ref.trim().length === 0) {
      return NextResponse.json(
        { error: "Reference ID or phone number is required" },
        { status: 400 }
      );
    }

    const project = await getClientProjectByRef(ref);

    if (!project) {
      return NextResponse.json(
        { error: "No active project found with this reference code or phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, project },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Tracker lookup API error:", error);
    return NextResponse.json(
      { error: "Internal server error while retrieving project" },
      { status: 500 }
    );
  }
}
