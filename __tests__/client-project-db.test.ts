import { describe, it, expect } from "vitest";
import {
  getClientProjects,
  getClientProjectByRef,
  createClientProject,
  updateClientProject,
  addSiteUpdate,
  createDefaultMilestones,
} from "@/lib/db";

describe("Client Project Tracking Database Layer", () => {
  it("initializes and returns default seeded projects", async () => {
    const projects = await getClientProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThanOrEqual(2);

    const sample = projects.find((p) => p.referenceId === "ION-7824");
    expect(sample).toBeDefined();
    expect(sample?.clientName).toBe("Eng. Tarek Mansour");
    expect(sample?.overallProgress).toBeGreaterThanOrEqual(60);
    expect(sample?.milestones.length).toBe(5);
    expect(sample?.siteUpdates.length).toBeGreaterThan(0);
  });

  it("finds a project by exact reference ID or phone match", async () => {
    const byRef = await getClientProjectByRef("ION-7824");
    expect(byRef).not.toBeNull();
    expect(byRef?.referenceId).toBe("ION-7824");

    // Case-insensitive lookup
    const byLower = await getClientProjectByRef("ion-7824");
    expect(byLower?.referenceId).toBe("ION-7824");

    // Phone lookup
    const byPhone = await getClientProjectByRef("01002345678");
    expect(byPhone?.referenceId).toBe("ION-7824");

    const nonExistent = await getClientProjectByRef("NON_EXISTENT_REF");
    expect(nonExistent).toBeNull();
  });

  it("creates, updates, and adds site inspection updates to a project", async () => {
    const testRef = `ION-TEST-${Date.now()}`;
    const newProj = await createClientProject({
      referenceId: testRef,
      clientName: "Mohamed Zaki",
      clientPhone: "+201099998888",
      unitType: "Duplex Villa",
      area: "260 m²",
      compound: { ar: "سوديك إيست", en: "Sodic East" },
      city: { ar: "الشروق", en: "Shorouk City" },
      contractDate: "2026-02-01",
      targetHandoverDate: "2026-06-01",
      overallProgress: 20,
      currentStage: "mep_rough_in",
      siteEngineer: {
        name: "Eng. Hisham",
        title: { ar: "مهندس التنفيذ", en: "Site Engineer" },
        phone: "+201026040854",
      },
      milestones: createDefaultMilestones(),
      siteUpdates: [],
    });

    expect(newProj.id).toBeDefined();
    expect(newProj.referenceId).toBe(testRef);

    // Update progress
    const updated = await updateClientProject(newProj.id, {
      overallProgress: 35,
    });
    expect(updated?.overallProgress).toBe(35);

    // Add site update
    const siteUpdate = await addSiteUpdate(newProj.id, {
      date: "2026-03-05",
      title: { ar: "تأسيس شبكة التكييف", en: "HVAC Copper Lines Tested" },
      notes: { ar: "تم تمديد مواسير التكييف بنجاح", en: "Copper conduits passed pressure tests" },
      imageUrl: "/uploads/test.jpg",
      phase: "mep_rough_in",
      engineerName: "Eng. Hisham",
    });

    expect(siteUpdate?.id).toBeDefined();

    // Verify retrieval
    const fetched = await getClientProjectByRef(testRef);
    expect(fetched?.overallProgress).toBe(35);
    expect(fetched?.siteUpdates.length).toBe(1);
    expect(fetched?.siteUpdates[0].title.en).toBe("HVAC Copper Lines Tested");
  });
});
