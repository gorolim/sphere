import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/webhooks/agents/social
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Expected payload: { entityType: string, entityId: string, platform: string, status: string }
        const { entityType, entityId, platform, status } = body;

        // In a real scenario, this endpoint would log the successful syndication of a Blog or Art piece to Twitter/LinkedIn.
        console.log(`[N8N_WEBHOOK_SOCIAL] Syndication reported: ${entityType} ${entityId} on ${platform} - Status: ${status}`);

        return NextResponse.json({ success: true, logged: true });
    } catch (error: any) {
        console.error("[N8N_WEBHOOK_SOCIAL] Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
