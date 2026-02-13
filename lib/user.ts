import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id }
        });
        return user;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}
