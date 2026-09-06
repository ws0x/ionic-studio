import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatEgyptPhone, dispatchClientProjectNotification } from "@/lib/notifications";
import { type ClientProject } from "@/lib/db";
import { POST as postSiteUpdate } from "@/app/api/admin/tracker/[id]/route";

import * as authModule from "@/lib/admin-auth";

describe("Client Project Milestone & Site Update Notifications", () => {
  const sampleProject: ClientProject = {
    id: "test_proj_notify_1",
    referenceId: "ION-TEST-NOTIF",
    clientName: "Dr. Sherif Zaki",
    clientPhone: "01009988776",
    unitType: "Penthouse",
    area: "280 m²",
    compound: { ar: "سوديك إيست", en: "Sodic East" },
    city: { ar: "القاهرة الجديدة", en: "New Cairo" },
    contractDate: "2026-01-01",
    targetHandoverDate: "2026-06-30",
    overallProgress: 45,
    currentStage: "civil_plaster",
    siteEngineer: {
      name: "Eng. Tarek Mostafa",
      title: { ar: "مهندس الموقع", en: "Lead Engineer" },
      phone: "+201026040854",
    },
    milestones: [],
    siteUpdates: [],
    notificationsSent: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL;
  });


  it("formats Egyptian mobile numbers to standard E.164 international format", () => {
    expect(formatEgyptPhone("01002345678")).toBe("+201002345678");
    expect(formatEgyptPhone("201119876543")).toBe("+201119876543");
    expect(formatEgyptPhone("+201026040854")).toBe("+201026040854");
    expect(formatEgyptPhone("012-345-67890")).toBe("+201234567890");
  });

  it("dispatches notification payload and records in audit log", async () => {
    const originalEnv = process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL;
    process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL = "https://mock-webhook.ionic.internal/notifications";

    let interceptedBody: unknown = null;
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (_url, init) => {
      if (init?.body) {
        interceptedBody = JSON.parse(init.body as string);
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    });

    const result = await dispatchClientProjectNotification(sampleProject, {
      title: { ar: "تم تركيب عزل الرطوبة", en: "Waterproofing membrane installed" },
      notes: { ar: "اجتياز فحص الرطوبة", en: "Passed 48-hour standing water leak test" },
      phase: "civil_plaster",
      eventType: "site_update",
    });

    expect(result.success).toBe(true);
    expect(result.dispatched).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
    expect(interceptedBody).toBeDefined();

    const body = interceptedBody as {
      event: string;
      notification: { clientPhone: string; projectRef: string };
      trackingLink: string;
    };
    expect(body.event).toBe("project.site_update_published");
    expect(body.notification.clientPhone).toBe("+201009988776");
    expect(body.notification.projectRef).toBe("ION-TEST-NOTIF");
    expect(body.trackingLink).toContain("ION-TEST-NOTIF");

    process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL = originalEnv;
  });

  it("remains resilient if client notification webhook throws or times out", async () => {
    process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL = "https://failing-webhook.ionic.internal";
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Connection reset by peer"));

    const result = await dispatchClientProjectNotification(sampleProject, {
      title: { ar: "تحديث اختباري", en: "Test update" },
      notes: { ar: "ملاحظات", en: "Notes" },
    });

    // Function does not crash, saves locally, returns gracefully
    expect(result.success).toBe(true);
    expect(result.dispatched).toBe(false);
  });

  it("triggers client notification when posting site update via API", async () => {
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValue(true);

    const req = new Request("http://localhost:3000/api/admin/tracker/ION-7824", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "2026-03-03",
        title: { ar: "فحص حديد التسليح", en: "Rebar inspection completed" },
        notes: { ar: "مطابق للمواصفات", en: "Engineered specifications verified on site" },
        phase: "civil_plaster",
        engineerName: "Eng. Ahmed El-Sherif",
        notifyClient: true,
      }),
    });

    const res = await postSiteUpdate(req, {
      params: Promise.resolve({ id: "ION-7824" }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.update.title.en).toBe("Rebar inspection completed");
  });
});
