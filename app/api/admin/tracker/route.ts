import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  getClientProjects,
  createClientProject,
  convertLeadToProject,
  createDefaultMilestones,
  type ClientProject,
} from "@/lib/db";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await getClientProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Admin get projects error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tracked projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 1-Click lead conversion
    if (body.leadId) {
      const converted = await convertLeadToProject(body.leadId);
      if (!converted) {
        return NextResponse.json(
          { error: "Failed to convert lead to project (lead not found or already converted)" },
          { status: 400 }
        );
      }
      return NextResponse.json({ project: converted }, { status: 201 });
    }

    // Manual creation
    if (!body.referenceId || !body.clientName || !body.clientPhone) {
      return NextResponse.json(
        { error: "Reference ID, client name, and phone are required." },
        { status: 400 }
      );
    }

    const newProjectInput: Omit<ClientProject, "id" | "createdAt" | "updatedAt"> = {
      referenceId: body.referenceId,
      clientName: body.clientName,
      clientPhone: body.clientPhone,
      unitType: body.unitType || "Residence",
      area: body.area || "200 m²",
      compound: body.compound || { ar: "مشروع خاص", en: "Private Compound" },
      city: body.city || { ar: "القاهرة", en: "Cairo" },
      contractDate: body.contractDate || new Date().toISOString().split("T")[0],
      targetHandoverDate:
        body.targetHandoverDate ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      overallProgress: typeof body.overallProgress === "number" ? body.overallProgress : 10,
      currentStage: body.currentStage || "concept_design",
      siteEngineer: body.siteEngineer || {
        name: "Eng. Ahmed El-Sherif",
        title: { ar: "مهندس الموقع التنفيذي", en: "Lead Site Engineer" },
        phone: "+201026040854",
      },
      milestones: body.milestones || createDefaultMilestones(),
      siteUpdates: body.siteUpdates || [],
    };

    const created = await createClientProject(newProjectInput);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("Admin create project error:", error);
    return NextResponse.json(
      { error: "Failed to create tracked project" },
      { status: 500 }
    );
  }
}
