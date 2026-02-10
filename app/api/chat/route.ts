
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { messages, agentId } = body;

        if (!messages || !agentId) {
            return new NextResponse("Missing input", { status: 400 });
        }

        // Check subscription or token limits
        // For now, pro users have unlimited, free users are limited? 
        // Let's implement simple tracking first.

        // Get Agent context/instructions
        const agent = await prisma.agent.findUnique({
            where: { id: agentId }
        });

        if (!agent) {
            return new NextResponse("Agent not found", { status: 404 });
        }

        if (!agent.isActive) {
            return new NextResponse("Agent configured as offline", { status: 403 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prepare context
        const context = `You are ${agent.name}, a ${agent.role} specialized in ${agent.field}. 
        Your mission is: ${agent.description}. 
        Vibe: ${agent.vibe || "Professional"}.
        
        User Query: ${messages[messages.length - 1].content}`;

        const result = await model.generateContent(context);
        const response = result.response;
        const text = response.text();

        // Estimate tokens (very rough approximation: 4 chars = 1 token)
        const inputTokens = Math.ceil(context.length / 4);
        const outputTokens = Math.ceil(text.length / 4);
        const totalTokens = inputTokens + outputTokens;

        // Record Usage
        await prisma.tokenUsage.create({
            data: {
                userId: user.id,
                agentId: agent.id,
                inputTokens,
                outputTokens,
                totalTokens
            }
        });

        // Trigger Automation: Agent Message
        const { triggerAutomation } = await import("@/lib/automation");
        await triggerAutomation("AGENT_MESSAGE", {
            agentId: agent.id,
            agentName: agent.name,
            userId: user.id,
            messages: [...messages, { role: "assistant", content: text }],
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({ role: "assistant", content: text });

    } catch (error) {
        console.error("[CHAT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
