import { NextResponse } from "next/server";
import { getContent } from "@/lib/db";
import {
  projects as fallbackProjects,
  finishingPackages as fallbackPackages,
  beforeAfterCases as fallbackBeforeAfter,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getContent();
    return NextResponse.json(
      {
        projects: data.projects || fallbackProjects,
        packages: data.packages || fallbackPackages,
        beforeAfter: data.beforeAfter || fallbackBeforeAfter,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Public content API error (serving fallback):", error);
    return NextResponse.json(
      {
        projects: fallbackProjects,
        packages: fallbackPackages,
        beforeAfter: fallbackBeforeAfter,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
