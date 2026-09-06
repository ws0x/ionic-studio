import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getDbPackages, updateDbPackage } from "@/lib/db";
import type { FinishingPackage } from "@/lib/content";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const packages = await getDbPackages();
  return NextResponse.json({ packages });
}

export async function PATCH(request: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id: FinishingPackage["id"];
      minRate?: number;
      maxRate?: number;
      turnaroundMonths?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Package ID is required." }, { status: 400 });
    }

    const updated = await updateDbPackage(body.id, {
      ...(body.minRate !== undefined && { minRate: Number(body.minRate) }),
      ...(body.maxRate !== undefined && { maxRate: Number(body.maxRate) }),
      ...(body.turnaroundMonths !== undefined && {
        turnaroundMonths: Number(body.turnaroundMonths),
      }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: updated });
  } catch (err) {
    console.error("Failed to update package rates:", err);
    return NextResponse.json({ error: "Failed to update package." }, { status: 500 });
  }
}
