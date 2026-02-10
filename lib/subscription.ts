
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
    const session = await auth();

    if (!session || !session.user) {
        return false;
    }

    const userSubscription = await prisma.subscription.findUnique({
        where: {
            userId: session.user.id
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
