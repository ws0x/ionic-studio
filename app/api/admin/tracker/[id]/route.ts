import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  updateClientProject,
  addSiteUpdate,
  getClientProjectByRef,
  type SiteUpdate,
} from "@/lib/db";
import { dispatchClientProjectNotification } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateClientProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (body.notifyClient === true) {
      await dispatchClientProjectNotification(updated, {
        title: {
          ar: `تحديث مرحلي في إنجاز المشروع (${updated.overallProgress}%)`,
          en: `Milestone progress updated (${updated.overallProgress}%)`,
        },
        notes: {
          ar: `تم اعتماد تقدم الأعمال في الموقع ليصبح الإنجاز الكلي للمشروع ${updated.overallProgress}%.`,
          en: `Construction progress updated. Overall project milestone completion reached ${updated.overallProgress}%.`,
        },
        phase: updated.currentStage,
        eventType: "milestone_progress",
      });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as Omit<SiteUpdate, "id"> & { notifyClient?: boolean };

    if (!body.title?.en || !body.notes?.en) {
      return NextResponse.json(
        { error: "Title and notes are required for site inspection update." },
        { status: 400 }
      );
    }

    const created = await addSiteUpdate(id, body);
    if (!created) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Automatically notify client unless explicitly disabled
    if (body.notifyClient !== false) {
      const project = await getClientProjectByRef(id);
      if (project) {
        await dispatchClientProjectNotification(project, {
          title: body.title,
          notes: body.notes,
          imageUrl: body.imageUrl,
          phase: body.phase,
          eventType: "site_update",
        });
      }
    }

    return NextResponse.json({ success: true, update: created }, { status: 201 });
  } catch (error) {
    console.error("Add site update error:", error);
    return NextResponse.json(
      { error: "Failed to post site update" },
      { status: 500 }
    );
  }
}

