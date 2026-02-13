
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// This should be an environment variable, but for now we'll define it here or fetch from env
// e.g. price_1Q........
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.email) {
            return NextResponse.json({ message: "Unauthorized: User not found" }, { status: 401 });
        }

        if (!PRO_PRICE_ID) {
            console.error("Missing STRIPE_PRO_PRICE_ID");
            return new NextResponse("Server Configuration Error", { status: 500 });
        }

        // 1. Check if user already has a stripeCustomerId
        // We need to fetch the user from DB to get the Stripe ID, as the session User might be stale
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!dbUser) return new NextResponse("User not found", { status: 404 });

        let stripeCustomerId = dbUser.stripeCustomerId;

        // 2. If not, create one in Stripe and save to DB
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: {
                    userId: user.id
                }
            });
            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId }
            });
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            metadata: {
                userId: user.id
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
