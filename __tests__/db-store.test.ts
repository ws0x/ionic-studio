import { describe, it, expect } from "vitest";
import {
  getContent,
  getDbPackages,
  updateDbPackage,
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "@/lib/db";

describe("Database & Content Storage Layer", () => {
  it("initializes and returns default seeded content", async () => {
    const content = await getContent();
    expect(content.packages.length).toBeGreaterThanOrEqual(3);
    expect(content.projects.length).toBeGreaterThanOrEqual(3);
    expect(content.beforeAfter.length).toBeGreaterThanOrEqual(3);
  });

  it("can update finishing package rates dynamically", async () => {
    const originalPackages = await getDbPackages();
    const signature = originalPackages.find((p) => p.id === "signature");
    expect(signature).toBeDefined();

    const updated = await updateDbPackage("signature", {
      minRate: 10000,
      maxRate: 13000,
    });

    expect(updated).not.toBeNull();
    expect(updated?.minRate).toBe(10000);
    expect(updated?.maxRate).toBe(13000);

    // Restore
    await updateDbPackage("signature", {
      minRate: 9500,
      maxRate: 12500,
    });
  });

  it("creates, retrieves, updates, and deletes leads", async () => {
    const initialLeads = await getLeads();
    expect(initialLeads.length).toBeGreaterThanOrEqual(0);

    const uniqueRef = `IONIC-TEST-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const lead = await createLead({
      referenceId: uniqueRef,
      name: "Tarek Client",
      phone: "01011112222",

      type: "Full finishing",
      stage: "Core & Shell",
      area: "250",
      city: "Katameya Dunes",
      details: "Villa turnkey finishing",
    });

    expect(lead.id).toMatch(/^lead_/);
    expect(lead.status).toBe("new");

    // 2. Retrieve
    const fetched = await getLeadById(lead.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe("Tarek Client");

    // 3. Update status & notes
    const updated = await updateLead(lead.id, {
      status: "survey_scheduled",
      notes: "Architectural inspection scheduled for Thursday 2pm.",
    });

    expect(updated?.status).toBe("survey_scheduled");
    expect(updated?.notes).toContain("Thursday 2pm");

    // 4. Delete
    const deleted = await deleteLead(lead.id);
    expect(deleted).toBe(true);

    const afterDelete = await getLeadById(lead.id);
    expect(afterDelete).toBeNull();
  });
});
