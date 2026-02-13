import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return false;
    }

    // We need to look up by clerkId, or if subscription links to user table properly
    // The previous code assumed userId = session.user.id (which was the DB ID)
    // Here we need to find the user first to get their DB ID, OR if subscription.userId is clerkId?
    // User schema says: id (cuid), clerkId (String). 
    // Subscription says: userId (String) referencing User.id.

    // So we need to get the User record first.
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        select: { id: true }
    });

    if (!user) return false;

    const userSubscription = await prisma.subscription.findUnique({
        where: {
            userId: user.id
        },
        select: {
            stripeSubscriptionId: true,
            currentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!userSubscription) return false;

    const isValid =
        userSubscription.stripePriceId &&
        userSubscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
}
