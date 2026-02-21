
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
    guideGender?: string;
    guideType?: string;
    guideVibe?: string;
    guideImageUrl?: string;
}) {
    console.log("[initializeAgentCompanion] Start called with:", data);
    try {
        console.log("[initializeAgentCompanion] Calling getCurrentUser...");
        const user = await getCurrentUser();
        console.log("[initializeAgentCompanion] getCurrentUser returned:", user ? user.id : "null");

        if (!user) {
            console.log("[initializeAgentCompanion] Unauthorized.");
            return { error: "Unauthorized" };
        }

        console.log("[initializeAgentCompanion] Calling Prisma to update user:", user.id);
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                hasGivenBirth: true,
                guideName: data.guideName,
                guidePrompt: data.guidePrompt,
                guideModel: data.guideModel,
                guideGender: data.guideGender || "Female",
                guideType: data.guideType || "Hologram",
                guideVibe: data.guideVibe || "The Magician",
                guideImageUrl: data.guideImageUrl || null,
            } as any
        });
        console.log("[initializeAgentCompanion] Prisma updated successfully.");

        console.log("[initializeAgentCompanion] Invoking revalidatePath...");
        revalidatePath("/master-admin");
        console.log("[initializeAgentCompanion] revalidatePath complete.");

        return { success: true, user: updated };
    } catch (e: any) {
        console.error("[initializeAgentCompanion] Catch block error:", e);
        return { error: "Failed to initialize the Companion." };
    }
}
