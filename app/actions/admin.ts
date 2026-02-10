
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export async function getAdminStats() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const [
        totalAgents,
        activeAgents,
        totalUsers,
        proUsers,
        totalPosts,
        publishedPosts,
        totalTokens
    ] = await Promise.all([
        prisma.agent.count(),
        prisma.agent.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.user.count({ where: { isPro: true } }),
        prisma.post.count(),
        prisma.post.count({ where: { status: "published" } }),
        prisma.tokenUsage.aggregate({
            _sum: { totalTokens: true }
        })
    ]);

    return {
        agents: { total: totalAgents, active: activeAgents },
        users: { total: totalUsers, pro: proUsers },
        posts: { total: totalPosts, published: publishedPosts },
        tokens: { total: totalTokens._sum.totalTokens || 0 }
    };
}
