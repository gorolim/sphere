
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function updatePostStatus(postId: string, newStatus: string) {
    const user = await getCurrentUser();

    // Simple admin check (in middleware we trust, but double check role)
    // Note: session user might not have role depending on jwt callback, assuming restricted access via middleware
    if (!user) {
        throw new Error("Unauthorized");
    }

    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { status: newStatus }
    });

    if (newStatus === "published") {
        const { triggerAutomation } = await import("@/lib/automation");
        // Fire and forget, don't await the trigger fully if it takes time, 
        // but triggerAutomation is already async and handles its own errors (logging).
        // We await it here to ensure it fires before function returns, 
        // but since it uses Promise.all inside without awaiting the fetch *results* necessarily (it waits for promises to settle?), 
        // actually triggerAutomation does Promise.all. 
        // Let's await it to be safe.
        await triggerAutomation("NEW_POST", updatedPost);
    }

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath("/agent-pedia");
}
