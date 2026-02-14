import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return null;
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;

        // Optimize: Check DB for user
        let user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id }
        });

        // ------------------------------------------------------------------
        // SELF-HEALING: If user exists in Clerk but not in DB, create them.
        // This handles cases where webhooks failed or were missed.
        // ------------------------------------------------------------------
        if (!user) {
            console.log(`[AUTH_SYNC] Cloud user ${clerkUser.id} missing in DB. Syncing now...`);

            if (email) {
                // Check for Master Admin override
                const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
                    email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();

                const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email.split('@')[0] || "Unknown Agent";

                try {
                    user = await prisma.user.create({
                        data: {
                            clerkId: clerkUser.id,
                            email,
                            name,
                            role: isMasterAdmin ? "admin" : "user",
                            isPro: isMasterAdmin ? true : false,
                        }
                    });
                    console.log(`[AUTH_SYNC] User ${user.id} synced successfully. Role: ${user.role}`);
                } catch (createError) {
                    console.error(`[AUTH_SYNC] Failed to create user ${clerkUser.id}:`, createError);
                    // Double check if it was created in parallel
                    user = await prisma.user.findUnique({
                        where: { clerkId: clerkUser.id }
                    });
                }
            } else {
                console.error(`[AUTH_SYNC] User ${clerkUser.id} has no email. Cannot sync.`);
            }
        }

        // FAIL-SAFE: If user is still null after sync attempt
        if (!user) {
            console.error(`[AUTH_SYNC] Critical: User still null after sync attempt for ${clerkUser.id}`);
            return null;
        }

        return user;
    } catch (error) {
        console.error("[GET_CURRENT_USER] Error:", error);
        // We return null so the caller handles the "not found" state
        return null;
    }
}
