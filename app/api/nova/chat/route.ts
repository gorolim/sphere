import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

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
        
        // Map messages to Gemini standard
        let history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "nova" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        // Gemini strictly requires the initial history sequence to begin with a 'user' message.
        // The frontend prepends Nova's greeting by default, so we must slice it out.
        while (history.length > 0 && history[0].role === "model") {
            history.shift();
        }

        const lastUserMessage = messages[messages.length - 1]?.content || "Hello.";

        let apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            const fs = require('fs');
            const path = require('path');
            try {
                const envPath = path.join(process.cwd(), '.env');
                const envContent = fs.readFileSync(envPath, 'utf-8');
                const keyLine = envContent.split('\n').find((line: string) => line.startsWith('GEMINI_API_KEY='));
                if (keyLine) {
                    apiKey = keyLine.split('=')[1].trim();
                }
            } catch (e) {
                console.error("Failed to read .env for GEMINI_API_KEY", e);
            }
        }

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing from environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: dynamicSystemPrompt,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastUserMessage);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("Nova Gemini Connection Error:", error);
        return NextResponse.json({ 
            response: "Runtime error: " + (error.message || String(error))
        }, { status: 500 });
    }
}
