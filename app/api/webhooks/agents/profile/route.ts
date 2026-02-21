import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/webhooks/agents/profile
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Expected payload: { userId: string, archetype: string, bio?: string, aiTone?: string }
        const { userId, archetype, bio, aiTone } = body;

        if (!userId || !archetype) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedPersona = await prisma.persona.upsert({
            where: {
                userId_archetype: {
                    userId,
                    archetype: archetype.toLowerCase(),
                },
            },
            create: {
                userId,
                archetype: archetype.toLowerCase(),
                name: archetype,
                bio,
                aiTone,
            },
            update: {
                bio: bio !== undefined ? bio : undefined,
                aiTone: aiTone !== undefined ? aiTone : undefined,
            },
        });

        return NextResponse.json({ success: true, data: updatedPersona });
    } catch (error: any) {
        console.error("[N8N_WEBHOOK_PROFILE] Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
