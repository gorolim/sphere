import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { campaignId } = body;

        if (!campaignId) {
            return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });
        }

        const campaign = await prisma.marketingCampaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        // Note: In production, n8n webhook URLs would be retrieved from the AgentWorkflow model or ENV
        const N8N_CAMPAIGN_WEBHOOK_URL = process.env.N8N_CAMPAIGN_WEBHOOK_URL;
        
        if (N8N_CAMPAIGN_WEBHOOK_URL) {
            const n8nPayload = {
                campaign: {
                    id: campaign.id,
                    title: campaign.title,
                    rawAudioUrl: campaign.rawAudioUrl,
                    status: campaign.status
                },
                directive: "EXECUTE_OROBOROS_LOOP"
            };

            await fetch(N8N_CAMPAIGN_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(n8nPayload)
            });
            
            console.log(`[OROBOROS ENGINE] Dispatched campaign ${campaignId} to n8n.`);
        } else {
             console.warn("[OROBOROS ENGINE] Missing N8N_CAMPAIGN_WEBHOOK_URL. Proceeding in dry-run mode.");
        }

        return NextResponse.json({ success: true, message: "Oroboros sequence initiated" });

    } catch (error) {
        console.error("[CAMPAIGN ERROR]", error);
        return NextResponse.json({ error: "Failed to initiate campaign deployment" }, { status: 500 });
    }
}
