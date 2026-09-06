import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as quotePost } from "@/app/api/quote/route";
import { POST as loginPost } from "@/app/api/admin/auth/login/route";
import { POST as trackerPost } from "@/app/api/admin/tracker/route";

import { POST as postSiteUpdate } from "@/app/api/admin/tracker/[id]/route";
import { GET as trackPublicRoute } from "@/app/api/track/[ref]/route";
import { getLeadById, getClientProjectByRef } from "@/lib/db";
import * as authModule from "@/lib/admin-auth";

describe("End-to-End Customer Lifecycle & Multi-Role Pipeline", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL;
  });

  it("executes the complete workflow from quote submission to site inspection and client tracking", async () => {
    // -------------------------------------------------------------
    // Step 1: Prospective Client submits quote request on landing page
    // -------------------------------------------------------------
    const quoteReq = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Hesham Ezzat",
        phone: "+201019998888",
        type: "villa",
        stage: "construction",
        area: "420",
        city: "New Cairo",
        details: "Complete finishing for Lake View Residence villa with Italian marble",
      }),
    });

    const quoteRes = await quotePost(quoteReq);
    expect(quoteRes.status).toBe(200);
    const quoteData = await quoteRes.json();
    expect(quoteData.success).toBe(true);
    const leadRef = quoteData.leadId;
    expect(leadRef).toBeDefined();

    // Verify lead exists in database
    const lead = await getLeadById(leadRef);
    expect(lead).not.toBeNull();
    expect(lead?.name).toBe("Dr. Hesham Ezzat");

    // -------------------------------------------------------------
    // Step 2: Director logs in with master credentials
    // -------------------------------------------------------------
    const loginReq = new Request("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "ionic2026!" }),
    });

    const loginRes = await loginPost(loginReq);
    expect(loginRes.status).toBe(200);
    const loginData = await loginRes.json();
    expect(loginData.user.role).toBe("super_admin");
    expect(loginData.user.defaultRoute).toBe("/admin");

    // -------------------------------------------------------------
    // Step 3: Director converts lead into active tracked client project
    // -------------------------------------------------------------
    vi.spyOn(authModule, "isAuthenticated").mockResolvedValue(true);

    const convertReq = new Request("http://localhost:3000/api/admin/tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead?.id }),
    });

    const convertRes = await trackerPost(convertReq);
    expect(convertRes.status).toBe(201);
    const convertData = await convertRes.json();
    expect(convertData.project).toBeDefined();
    expect(convertData.project.referenceId).toBe(leadRef);
    expect(convertData.project.clientName).toBe("Dr. Hesham Ezzat");
    expect(convertData.project.milestones.length).toBe(5);

    // -------------------------------------------------------------
    // Step 4: Site Engineer logs in with site_engineer role
    // -------------------------------------------------------------
    const engLoginReq = new Request("http://localhost:3000/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "engineer", password: "site2026!" }),
    });

    const engLoginRes = await loginPost(engLoginReq);
    expect(engLoginRes.status).toBe(200);
    const engLoginData = await engLoginRes.json();
    expect(engLoginData.user.role).toBe("site_engineer");
    expect(engLoginData.user.defaultRoute).toBe("/admin/tracker");

    // Verify RBAC route policy restrictions for site engineer
    expect(authModule.hasRouteAccess("site_engineer", "/admin/tracker")).toBe(true);
    expect(authModule.hasRouteAccess("site_engineer", "/admin/packages")).toBe(false);
    expect(authModule.hasRouteAccess("site_engineer", "/admin/leads")).toBe(false);

    // -------------------------------------------------------------
    // Step 5: Site Engineer posts inspection update with client notification enabled
    // -------------------------------------------------------------
    let webhookIntercepted = false;
    process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL = "https://mock-outbound-webhook.internal/test";
    vi.spyOn(global, "fetch").mockImplementation(async (url) => {
      if (typeof url === "string" && url.includes("mock-outbound-webhook.internal")) {
        webhookIntercepted = true;
      }
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    });

    const siteUpdateReq = new Request(
      `http://localhost:3000/api/admin/tracker/${convertData.project.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: "2026-03-05",
          title: {
            ar: "استكمال شبكة الكهروميكانيك والتكييف المركزي",
            en: "Central HVAC ducting & MEP rough-ins certified",
          },
          notes: {
            ar: "تم مطابقة المواصفات الهندسية واعتماد مسارات التكييف الكونسيلد.",
            en: "Concealed AC routing approved and pressure tested according to Egyptian code.",
          },
          imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=1200",
          phase: "mep_rough_in",
          engineerName: "Eng. Tarek Mostafa",
          notifyClient: true,
        }),
      }
    );

    const siteUpdateRes = await postSiteUpdate(siteUpdateReq, {
      params: Promise.resolve({ id: convertData.project.id }),
    });

    expect(siteUpdateRes.status).toBe(201);
    expect(webhookIntercepted).toBe(true);

    // -------------------------------------------------------------
    // Step 6: Homeowner looks up their project on the public tracker
    // -------------------------------------------------------------
    const trackReq = new Request(`http://localhost:3000/api/track/${leadRef}`);
    const trackRes = await trackPublicRoute(trackReq, {
      params: Promise.resolve({ ref: leadRef }),
    });

    expect(trackRes.status).toBe(200);
    const trackData = await trackRes.json();
    expect(trackData.project).toBeDefined();
    expect(trackData.project.referenceId).toBe(leadRef);
    expect(trackData.project.clientName).toBe("Dr. Hesham Ezzat");
    expect(trackData.project.siteUpdates.length).toBeGreaterThanOrEqual(1);
    expect(trackData.project.siteUpdates[0].title.en).toBe(
      "Central HVAC ducting & MEP rough-ins certified"
    );

    // Verify notification was audited in project model
    const savedProject = await getClientProjectByRef(leadRef);
    expect(savedProject?.notificationsSent).toBeDefined();
    expect(savedProject?.notificationsSent?.length).toBeGreaterThanOrEqual(1);
  });
});
