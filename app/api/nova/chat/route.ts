import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const adminEmail = process.env.MASTER_ADMIN_EMAIL || "rrolim.rafael@gmail.com";
        const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        const userId = adminUser?.id;

        const { messages, userContext } = await req.json();
        
        // Fetch the User's Long-Term Memory (Semantic Context)
        const recentJourneys = userId ? await prisma.journeyEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3
        }) : [];
        
        const recentArt = userId ? await prisma.marketplaceArt.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3
        }) : [];
        
        const activeGigs = userId ? await prisma.serviceGig.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3
        }) : [];

        // We pass the active UI customizations as a system prompt to the OpenClaw daemon
        // so it overlays these traits onto its core SOUL.md persona.
        const dynamicSystemPrompt = `
You are currently interfacing with the Master Admin: ${userContext?.username || 'Unknown'} (Level: ${userContext?.onboardingScore || 0}).
Your active Designation/Name is: ${userContext?.guideName || 'Nova'}
Your Avatar Gender: ${userContext?.guideGender || 'Female'}
Your Form/Type: ${userContext?.guideType || 'Hologram'}
Your Personality Core Archetype: ${userContext?.guideVibe || 'The Magician'}

---
USER'S LONG-TERM MEMORY & CONTEXT
The following is the latest data extracted from the user's Engine Sphere Hub. 
Use this to maintain continuity and refer to their actual projects when communicating.

[RECENT TRAVEL/JOURNEY LOGS]
${recentJourneys.length > 0 ? recentJourneys.map(j => `- [${j.createdAt.toISOString().split('T')[0]}] ${j.location || 'Unknown Location'}: ${j.rawInput.substring(0, 150)}... (Status: ${j.status})`).join('\n') : "No recent journeys recorded."}

[RECENT MARKETPLACE ART (THE SPIRIT)]
${recentArt.length > 0 ? recentArt.map(a => `- [${a.createdAt.toISOString().split('T')[0]}] ${a.title || 'Untitled'}: ${a.rawVision.substring(0, 150)}... (Status: ${a.status})`).join('\n') : "No recent art listings created."}

[ACTIVE SERVICE GIGS (THE MIND)]
${activeGigs.length > 0 ? activeGigs.map(g => `- ${g.title} ($${g.price || 'FREE'})`).join('\n') : "No active service gigs."}
---
`;
        
        // Map messages to OpenAI standard which OpenClaw uses natively
        const mappedMessages = messages.map((msg: any) => ({
            role: msg.role === "nova" ? "assistant" : "user",
            content: msg.content,
        }));

        // Insert the dynamic system prompt at the beginning
        const finalMessages = [
            { role: "system", content: dynamicSystemPrompt },
            ...mappedMessages
        ];

        // Route the request to the Railway OpenClaw daemon process over the public interface
        // This allows local dev instances of the Engine Sphere Hub to connect securely 
        const openclawHost = process.env.OPENCLAW_HOST || "devoted-love-production.up.railway.app";
        const clawRes = await fetch(`https://${openclawHost}/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google-antigravity/gemini-3.1-pro-high",
                messages: finalMessages,
                // Passing the userId allows OpenClaw to isolate persistent memory per user
                user: userContext?.userId || "anonymous",
                temperature: 0.7,
            })
        });

        if (!clawRes.ok) {
            const errText = await clawRes.text();
            console.error("OpenClaw Daemon Error:", errText);
            
            // Helpful message if the daemon is simply not running yet
            if (clawRes.status === 404 || errText.includes("ECONNREFUSED")) {
                return NextResponse.json({ 
                    response: "Neural Net Offline. Please run `npx openclaw serve --workspace ./nova-agent` in your terminal to boot my cognitive core." 
                });
            }
            
            throw new Error(`OpenClaw returned ${clawRes.status}`);
        }

        const data = await clawRes.json();
        const response = data.choices[0].message.content;

        // The OpenClaw Daemon automatically handles writing to the Markdown progression logs in the background 
        // as well as registering the user's heartbeat pulse.

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Nova OpenClaw Connection Error:", error);
        return NextResponse.json({ 
            response: "My cognitive runtime (OpenClaw) is currently unreachable. Please ensure the daemon is running on port 18789." 
        });
    }
}
