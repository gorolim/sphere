
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Simple security
    if (secret !== "STATUS_CHECK") {
        return NextResponse.json({ status: "optimized", message: "System nominal." }, { status: 200 });
    }

    try {
        const start = Date.now();
        await prisma.$connect();
        const latency = Date.now() - start;

        const userCount = await prisma.user.count();
        const agentCount = await prisma.agent.count();

        return NextResponse.json({
            status: "online",
            latency: `${latency}ms`,
            database: "connected",
            stats: {
                users: userCount,
                agents: agentCount
            },
            env: {
                node_env: process.env.NODE_ENV,
                database_url_set: !!process.env.DATABASE_URL,
                clerk_secret_set: !!process.env.CLERK_SECRET_KEY,
                webhook_secret_set: !!process.env.WEBHOOK_SECRET,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "degraded",
            database: "disconnected",
            error: error.message
        }, { status: 503 });
    }
}
