// ── Simulation API stub ──────────────────────────────────────────────────────
// CMS-ready contract. Today it serves the static catalogue from lib/simulation.
// When the CMS (Payload) lands, only this handler's body changes — the response
// shape (SimulationPayload) and the frontend stay identical.

import { NextResponse } from "next/server";
import { getSimulationPayload } from "@/lib/simulation/catalog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = getSimulationPayload(id);

  if (!payload) {
    return NextResponse.json(
      { error: `Simulation project '${id}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(payload);
}
