import { NextResponse } from "next/server";
import { site, waLink } from "@/lib/site";
import { createLead } from "@/lib/db";

export interface QuotePayload {
  name: string;
  phone: string;
  type?: string;
  stage?: string;
  area?: string;
  city?: string;
  details?: string;
}

// In-memory lead buffer (in production, easily forwarded to CRM / Telegram / Webhook)
export const leadStore: Array<QuotePayload & { id: string; createdAt: string }> = [];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<QuotePayload>;

    const name = body.name?.trim();
    const phone = body.phone?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 8) {
      return NextResponse.json(
        { error: "A valid phone number is required." },
        { status: 400 }
      );
    }

    // Generate unique human-readable lead reference
    const id = `IONIC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const record = {
      id,
      name,
      phone,
      type: body.type != null ? String(body.type).trim() : "unspecified",
      stage: body.stage != null ? String(body.stage).trim() : "unspecified",
      area: body.area != null ? String(body.area).trim() : "",
      city: body.city != null ? String(body.city).trim() : "",
      details: body.details != null ? String(body.details).trim() : "",
      createdAt,
    };

    leadStore.push(record);

    try {
      await createLead({
        referenceId: id,
        name,
        phone,
        type: record.type,
        stage: record.stage,
        area: record.area,
        city: record.city,
        details: record.details,
      });
    } catch (dbErr) {
      console.warn("Failed to persist lead to database:", dbErr);
    }

    // Build the formatted WhatsApp message
    const msgLines = [
      `*طلب استشارة جديد: ${site.name.ar}*`,
      `المرجع: #${id}`,
      `الاسم: ${name}`,
      `الهاتف: ${phone}`,
      body.type && `نوع المشروع: ${body.type}`,
      body.stage && `حالة الوحدة: ${body.stage}`,
      body.area && `المساحة: ${body.area} م²`,
      body.city && `المنطقة: ${body.city}`,
      body.details && `تفاصيل: ${body.details}`,
    ].filter(Boolean);

    const whatsappUrl = waLink(msgLines.join("\n"));

    // Optional Outbound Webhook dispatch (Telegram / Discord / CRM)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "lead.created",
            lead: record,
          }),
          signal: AbortSignal.timeout(3000),
        });
      } catch (webhookErr) {
        console.warn("Outbound lead webhook dispatch failed (non-blocking):", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: id,
      createdAt,
      whatsappUrl,
    });
  } catch (err) {
    console.error("Failed to process quote request:", err);
    return NextResponse.json(
      { error: "Internal server error processing quote request." },
      { status: 500 }
    );
  }
}
