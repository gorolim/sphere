
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function createAutomation(name: string, triggerType: string, webhookUrl: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.automation.create({
        data: {
            name,
            triggerType,
            webhookUrl,
            userId: user.id,
            isActive: true
        }
    });

    revalidatePath("/automation");
}

export async function toggleAutomation(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const automation = await prisma.automation.findUnique({ where: { id } });
    if (!automation || automation.userId !== user.id) throw new Error("Not found");

    await prisma.automation.update({
        where: { id },
        data: { isActive: !automation.isActive }
    });

    revalidatePath("/automation");
}

export async function deleteAutomation(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const automation = await prisma.automation.findUnique({ where: { id } });
    if (!automation || automation.userId !== user.id) throw new Error("Not found");

    await prisma.automation.delete({ where: { id } });

    revalidatePath("/automation");
}
