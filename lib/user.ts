import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// Define a safe fallback user type or return null
// We return null to force the UI to handle the "not found" state responsibly

export async function getCurrentUser(): Promise<User | null> {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return null;
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            console.error(`[GET_CURRENT_USER] Clerk User ${clerkUser.id} has no email address. Cannot sync.`);
            return null;
        }

        // 1. Try to find user by Clerk ID
        // We use a try/catch around the DB call itself to catch connection errors
        let user: User | null = null;

        try {
            user = await prisma.user.findUnique({
                where: { clerkId: clerkUser.id }
            });
        } catch (dbError) {
            console.error(`[GET_CURRENT_USER] Database Connection Error (ClerkID Lookup):`, dbError);
            // Should we throw? Or returns null?
            // Returning null might trigger a "Sign In" flow which is confusing if DB is down.
            // But throwing crashes the page. 
            // Ideally we return null and let the UI show a "Connection Error" if it persists.
            return null;
        }

        if (user) {
            return user;
        }

        console.warn(`[GET_CURRENT_USER] User ${clerkUser.id} not found in DB. Attempting sync.`);

        // ------------------------------------------------------------------
        // SELF-HEALING: If user exists in Clerk but not in DB, create/sync them.
        // ------------------------------------------------------------------

        // Check for Master Admin override
        const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
            email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();

        if (isMasterAdmin) {
            console.log(`[AUTH_SYNC] DETECTED MASTER ADMIN EMAIL: ${email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}`);
        }

        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email.split('@')[0] || "Unknown Agent";

        try {
            // 2. Race Condition / Legacy Account Handling
            // Check if user exists by email (to avoid unique constraint errors if clerkId changed or if we have legacy data)
            const existingUserRaw = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUserRaw) {
                console.log(`[AUTH_SYNC] User found by email ${email} but clerkId mismatch. Updating clerkId.`);

                // Update the existing record to link to this new Clerk ID
                user = await prisma.user.update({
                    where: { id: existingUserRaw.id },
                    data: {
                        clerkId: clerkUser.id,
                        name: existingUserRaw.name || name, // Keep existing name if present
                        // Ensure admin role if they are master admin
                        role: isMasterAdmin ? "admin" : existingUserRaw.role,
                        isPro: isMasterAdmin ? true : existingUserRaw.isPro
                    }
                });
            } else {
                console.log(`[AUTH_SYNC] Creating new user for ${email}`);
                // Create new user
                user = await prisma.user.create({
                    data: {
                        clerkId: clerkUser.id,
                        email,
                        name,
                        role: isMasterAdmin ? "admin" : "user",
                        isPro: isMasterAdmin ? true : false,
                    }
                });
            }

            console.log(`[AUTH_SYNC] User ${user.id} synced successfully. Role: ${user.role}`);
            return user;

        } catch (syncError) {
            console.error(`[AUTH_SYNC] Failed to sync user ${clerkUser.id}:`, syncError);

            // ONE FINAL CHECK: Did it get created in parallel?
            try {
                const finalCheck = await prisma.user.findUnique({
                    where: { clerkId: clerkUser.id }
                });
                if (finalCheck) return finalCheck;
            } catch (e) {
                // Ignore
            }

            return null;
        }

    } catch (error) {
        console.error("[GET_CURRENT_USER] Critical Error:", error);
        return null;
    }
}
