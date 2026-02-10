
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
