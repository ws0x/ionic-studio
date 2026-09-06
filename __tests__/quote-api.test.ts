import { describe, it, expect } from "vitest";
import { POST, leadStore } from "@/app/api/quote/route";

describe("POST /api/quote", () => {
  it("rejects request if name is missing or too short", async () => {
    const req = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", phone: "01060965845" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Name is required");
  });

  it("rejects request if phone is missing or too short", async () => {
    const req = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Sherif", phone: "123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("valid phone number");
  });

  it("successfully captures a valid quote request and returns leadId & whatsappUrl", async () => {
    const initialCount = leadStore.length;
    const req = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Youssef Client",
        phone: "01012345678",
        type: "Full finishing",
        stage: "Core & Shell",
        area: "220",
        city: "New Cairo",
        details: "Interested in luxury Italian finishes",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.leadId).toMatch(/^IONIC-/);
    expect(data.whatsappUrl).toContain("https://wa.me/");
    expect(leadStore.length).toBe(initialCount + 1);

    const saved = leadStore[leadStore.length - 1];
    expect(saved.name).toBe("Youssef Client");
    expect(saved.phone).toBe("01012345678");
    expect(saved.area).toBe("220");
  });

  it("dispatches to LEAD_WEBHOOK_URL when configured", async () => {
    const originalWebhook = process.env.LEAD_WEBHOOK_URL;
    const originalFetch = global.fetch;
    process.env.LEAD_WEBHOOK_URL = "https://webhook.site/test-endpoint";

    let fetchedUrl = "";
    let fetchedBody: { event: string; lead: { name: string } } | null = null;

    global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      fetchedUrl = url.toString();
      fetchedBody = JSON.parse(init?.body as string) as { event: string; lead: { name: string } };
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as typeof fetch;

    try {
      const req = new Request("http://localhost:3000/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Webhook Test Lead",
          phone: "01099998888",
          city: "Sheikh Zayed",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      expect(fetchedUrl).toBe("https://webhook.site/test-endpoint");
      expect(fetchedBody.event).toBe("lead.created");
      expect(fetchedBody.lead.name).toBe("Webhook Test Lead");
    } finally {
      process.env.LEAD_WEBHOOK_URL = originalWebhook;
      global.fetch = originalFetch;
    }
  });

  it("remains resilient and returns 200 even if webhook fails or times out", async () => {
    const originalWebhook = process.env.LEAD_WEBHOOK_URL;
    const originalFetch = global.fetch;
    process.env.LEAD_WEBHOOK_URL = "https://webhook.site/failing-endpoint";

    global.fetch = (async () => {
      throw new Error("Network timeout or connection refused");
    }) as typeof fetch;

    try {
      const req = new Request("http://localhost:3000/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Fault Tolerant Lead",
          phone: "01077776666",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.leadId).toBeDefined();
    } finally {
      process.env.LEAD_WEBHOOK_URL = originalWebhook;
      global.fetch = originalFetch;
    }
  });
});
