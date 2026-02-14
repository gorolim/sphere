
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export async function getAdminStats() {
    try {
        const user = await getCurrentUser();

        // Secure: Only allow actual admins
        if (!user || user.role !== "admin") {
            console.warn("[ADMIN_STATS] Unauthorized access attempt", user?.id);
            return {
                error: "Unauthorized",
                role: user?.role || "unknown",
                userId: user?.id || "unknown",
                agents: { total: 0, active: 0 },
                users: { total: 0, pro: 0 },
                posts: { total: 0, published: 0 },
                tokens: { total: 0 }
            };
        }

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
    } catch (error: any) {
        console.error("[ADMIN_STATS] Failed to fetch stats:", error);
        return {
            error: "System Error",
            details: error.message,
            agents: { total: 0, active: 0 },
            users: { total: 0, pro: 0 },
            posts: { total: 0, published: 0 },
            tokens: { total: 0 }
        };
    }
}
