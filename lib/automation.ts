
import { prisma } from "@/lib/db";

type TriggerType = "NEW_POST" | "USER_SIGNUP" | "AGENT_MESSAGE";

export async function triggerAutomation(type: TriggerType, payload: any) {
    console.log(`[AUTOMATION] Triggering ${type}`, payload);

    try {
        // 1. Fetch active automations for this trigger type
        // In a real multi-tenant app, you'd filter by userId too, but for system-wide events like "User Signup" or "Public Post",
        // we might want admin automations. For now, let's fetch ALL matching active automations.
        // If the event is user-specific (like "My Agent Chatted"), we should filter.
        // For Phase 1 (Outbound Triggers), we'll keep it simple.

        const automations = await prisma.automation.findMany({
            where: {
                triggerType: type,
                isActive: true
            }
        });

        if (automations.length === 0) {
            console.log(`[AUTOMATION] No active workflows found for ${type}`);
            return;
        }

        // 2. Fire Webhooks asynchronously
        const promises = automations.map(async (auto) => {
            try {
                const response = await fetch(auto.webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Engine-Sphere-Event": type
                    },
                    body: JSON.stringify({
                        event: type,
                        timestamp: new Date().toISOString(),
                        payload
                    })
                });

                if (!response.ok) {
                    console.error(`[AUTOMATION] Webhook failed for ${auto.name}: ${response.statusText}`);
                } else {
                    console.log(`[AUTOMATION] Webhook fired for ${auto.name}`);
                }
            } catch (err) {
                console.error(`[AUTOMATION] Network error for ${auto.name}`, err);
            }
        });

        // Fire and forget (don't block the main thread)
        Promise.all(promises);

    } catch (error) {
        console.error("[AUTOMATION] Error processing triggers", error);
    }
}
