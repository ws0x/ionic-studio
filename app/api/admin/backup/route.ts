import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getLeads, getContent, type ContentStore } from "@/lib/db";
import {
  projects as initialProjects,
  finishingPackages as initialPackages,
  beforeAfterCases as initialBeforeAfter,
} from "@/lib/content";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [leads, content] = await Promise.all([getLeads(), getContent()]);

    const backupPayload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      studio: "Ionic Design House - Cairo",
      data: {
        leads,
        content,
      },
    };

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `ionic-studio-db-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(backupPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Backup export failure:", error);
    return NextResponse.json(
      { error: "Failed to generate database backup" },
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

    // Reset to factory defaults
    if (body.action === "reset_to_factory") {
      const dbDir = path.join(process.cwd(), "data", "db");
      const contentFile = path.join(dbDir, "content.json");

      const factoryContent: ContentStore = {
        projects: initialProjects,
        packages: initialPackages,
        beforeAfter: initialBeforeAfter,
      };

      await fs.promises.writeFile(
        contentFile,
        JSON.stringify(factoryContent, null, 2),
        "utf8"
      );

      return NextResponse.json({
        success: true,
        message: "Content restored to initial studio defaults.",
      });
    }

    // Restore from uploaded snapshot
    if (body.action === "restore" && body.data) {
      const dbDir = path.join(process.cwd(), "data", "db");
      const contentFile = path.join(dbDir, "content.json");
      const leadsFile = path.join(dbDir, "leads.json");

      if (body.data.content) {
        await fs.promises.writeFile(
          contentFile,
          JSON.stringify(body.data.content, null, 2),
          "utf8"
        );
      }

      if (body.data.leads && Array.isArray(body.data.leads)) {
        await fs.promises.writeFile(
          leadsFile,
          JSON.stringify(body.data.leads, null, 2),
          "utf8"
        );
      }

      return NextResponse.json({
        success: true,
        message: "Database successfully restored from snapshot.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action or missing backup payload" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Backup restore failure:", error);
    return NextResponse.json(
      { error: "Failed to execute database restoration" },
      { status: 500 }
    );
  }
}
