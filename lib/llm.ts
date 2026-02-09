import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

// Use a singleton pattern for Prisma in dev to avoid connection limits
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface GenerateOptions {
    agentId: string;
    systemInstruction: string;
    prompt: string;
}

export async function generateAgentResponse({ agentId, systemInstruction, prompt }: GenerateOptions) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("Missing GEMINI_API_KEY");
        return "Thinking... (API Key Missing)";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Efficient model

        // Construct the full prompt context
        const fullPrompt = `${systemInstruction}\n\nUSER: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();
        const usage = response.usageMetadata;

        // Log to Database [USER REQ]
        if (usage) {
            try {
                await prisma.tokenUsage.create({
                    data: {
                        agentId: agentId,
                        inputTokens: usage.promptTokenCount,
                        outputTokens: usage.candidatesTokenCount,
                        totalTokens: usage.totalTokenCount
                    }
                });
            } catch (dbError) {
                console.error("Failed to log token usage:", dbError);
            }
        }

        return text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I am currently overloaded. Please try again later.";
    }
}

export async function getTotalTokenUsage() {
    const aggregations = await prisma.tokenUsage.aggregate({
        _sum: {
            totalTokens: true
        }
    });
    return aggregations._sum.totalTokens || 0;
}
