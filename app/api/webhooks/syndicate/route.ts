import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { artworkId, platforms } = body;

        if (!artworkId || !platforms || !Array.isArray(platforms)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const artwork = await prisma.marketplaceArt.findUnique({
            where: { id: artworkId },
        });

        if (!artwork) {
            return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
        }

        // Note: In production, n8n webhook URLs would be retrieved from the AgentWorkflow model or ENV
        const N8N_SYNDICATE_WEBHOOK_URL = process.env.N8N_SYNDICATE_WEBHOOK_URL;
        
        if (N8N_SYNDICATE_WEBHOOK_URL) {
            // Forward the deployment payload to n8n 
            const n8nPayload = {
                artwork: {
                    id: artwork.id,
                    title: artwork.title,
                    description: artwork.description,
                    imageUrl: artwork.imageUrl,
                    price: artwork.price,
                },
                platforms: platforms // e.g., ['gumroad', 'opensea', 'printful']
            };

            await fetch(N8N_SYNDICATE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(n8nPayload)
            });
            
            // Log that syndication has started
            console.log(`[SYNDICATION ENGINE] Dispatched artwork ${artworkId} to n8n for platforms:`, platforms);
        } else {
             console.warn("[SYNDICATION ENGINE] Missing N8N_SYNDICATE_WEBHOOK_URL. Proceeding in dry-run mode.");
        }

        return NextResponse.json({ success: true, message: "Syndication sequence initiated" });

    } catch (error) {
        console.error("[SYNDICATION ERROR]", error);
        return NextResponse.json({ error: "Failed to initiate syndication" }, { status: 500 });
    }
}
