import { getCurrentUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
    const user = await getCurrentUser();

    if (!user) {
        return false;
    }

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
