import { addClientProjectNotification, type ClientProject } from "@/lib/db";


export interface ProjectNotificationPayload {
  projectId: string;
  projectRef: string;
  clientName: string;
  clientPhone: string;
  title: string;
  summary: string;
  phase?: string;
  photoUrl?: string;
  eventType: "site_update" | "milestone_progress";
}

export function formatEgyptPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("20")) {
    return `+${clean}`;
  }
  if (clean.startsWith("0")) {
    return `+20${clean.substring(1)}`;
  }
  return `+20${clean}`;
}

export async function dispatchClientProjectNotification(
  project: ClientProject,
  update: {
    title: { ar: string; en: string };
    notes: { ar: string; en: string };
    imageUrl?: string;
    phase?: string;
    eventType?: "site_update" | "milestone_progress";
  }
): Promise<{ success: boolean; dispatched: boolean }> {
  try {
    const formattedPhone = formatEgyptPhone(project.clientPhone);
    const trackingLink = `https://ionicstudio.eg/track?id=${project.referenceId}`;
    const eventType = update.eventType || "site_update";

    const payload: ProjectNotificationPayload = {
      projectId: project.id,
      projectRef: project.referenceId,
      clientName: project.clientName,
      clientPhone: formattedPhone,
      title: update.title.en || update.title.ar,
      summary: update.notes.en || update.notes.ar,
      phase: update.phase,
      photoUrl: update.imageUrl,
      eventType,
    };

    // Save audit notification to project database
    await addClientProjectNotification(project.id, {
      channel: "webhook",
      recipientName: project.clientName,
      recipientPhone: formattedPhone,
      eventType,
      title: `${update.title.en} (${project.referenceId})`,
      status: "dispatched",
    });

    // Optional Outbound Webhook dispatch (WhatsApp Business API / SMS gateway / CRM)
    const webhookUrl = process.env.CLIENT_NOTIFICATIONS_WEBHOOK_URL;
    let dispatched = false;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "project.site_update_published",
            notification: payload,
            trackingLink,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(3000),
        });
        dispatched = true;
      } catch (webhookErr) {
        console.warn("Outbound client project notification webhook failed (non-blocking):", webhookErr);
      }
    }

    return { success: true, dispatched };
  } catch (err) {
    console.error("Failed to dispatch client project notification:", err);
    return { success: false, dispatched: false };
  }
}
