import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    try {
        let user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id }
        });

        // ------------------------------------------------------------------
        // SELF-HEALING: If user exists in Clerk but not in DB, create them.
        // This handles cases where webhooks failed or were missed.
        // ------------------------------------------------------------------
        if (!user) {
            console.log(`[AUTH_SYNC] Cloud user ${clerkUser.id} missing in DB. Syncing now...`);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email || "Unknown Agent";

            if (email) {
                user = await prisma.user.create({
                    data: {
                        clerkId: clerkUser.id,
                        email,
                        name,
                        role: "user",
                        isPro: false,
                        // image: clerkUser.imageUrl, // Optional: add if schema supports it
                    }
                });
                console.log(`[AUTH_SYNC] User ${user.id} synced successfully.`);
            } else {
                console.error(`[AUTH_SYNC] User ${clerkUser.id} has no email. Cannot sync.`);
            }
        }

        return user;
    } catch (error) {
        console.error("Error fetching/syncing current user:", error);
        return null;
    }
}
