import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/webhooks/agents/storytelling
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Expected payload: { entryId: string, aiContent: string, status?: string, title?: string }
        const { entryId, aiContent, status, title } = body;

        if (!entryId || !aiContent) {
            return NextResponse.json({ error: "Missing entryId or aiContent" }, { status: 400 });
        }

        const updatedEntry = await prisma.journeyEntry.update({
            where: { id: entryId },
            data: {
                aiContent,
                title: title !== undefined ? title : undefined,
                status: status || "DRAFT_REVIEW",
            },
        });

        return NextResponse.json({ success: true, data: updatedEntry });
    } catch (error: any) {
        console.error("[N8N_WEBHOOK_STORYTELLING] Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
