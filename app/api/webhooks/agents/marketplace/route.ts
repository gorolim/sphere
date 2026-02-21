import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/webhooks/agents/marketplace
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Expected payload: { artId: string, description: string, price?: number, title?: string, status?: string }
        const { artId, description, price, title, status } = body;

        if (!artId || !description) {
            return NextResponse.json({ error: "Missing artId or description" }, { status: 400 });
        }

        const updatedArt = await prisma.marketplaceArt.update({
            where: { id: artId },
            data: {
                description,
                title: title !== undefined ? title : undefined,
                price: price !== undefined ? price : undefined,
                status: status || "DRAFT_REVIEW",
            },
        });

        return NextResponse.json({ success: true, data: updatedArt });
    } catch (error: any) {
        console.error("[N8N_WEBHOOK_MARKETPLACE] Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
