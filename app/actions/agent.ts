
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function toggleAgentStatus(agentId: string, currentStatus: boolean) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");

    await prisma.agent.update({
        where: { id: agentId },
        data: { isActive: !currentStatus }
    });

    revalidatePath("/admin/agents");
    revalidatePath("/directory");
}

export async function initializeAgentCompanion(data: {
    guideName: string;
    guidePrompt: string;
    guideModel: string;
}) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                hasGivenBirth: true,
                guideName: data.guideName,
                guidePrompt: data.guidePrompt,
                guideModel: data.guideModel,
            }
        });

        // Force reload the admin layout to remove the blocker modal
        revalidatePath("/master-admin");

        return { success: true, user: updated };
    } catch (e: any) {
        console.error("Agent initialization error:", e);
        return { error: "Failed to initialize the Companion." };
    }
}
