import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Missing WEBHOOK_SECRET");
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers");
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Do something with the payload
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

    if (eventType === "user.created" || eventType === "user.updated") {
        try {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim() || email;

            if (email) {
                // Determine role based on email (Master Admin check)
                const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
                    email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();

                await prisma.user.upsert({
                    where: { clerkId: id },
                    update: {
                        name,
                        email,
                        // image: image_url, 
                        // If they are master admin, ensure they keep that role/status
                        ...(isMasterAdmin ? { role: "admin", isPro: true } : {})
                    },
                    create: {
                        clerkId: id,
                        name,
                        email,
                        role: isMasterAdmin ? "admin" : "user",
                        isPro: isMasterAdmin ? true : false,
                    },
                });
                console.log(`[WEBHOOK] User ${id} (${email}) upserted successfully`);
            } else {
                console.warn(`[WEBHOOK] User ${id} has no email address, skipping upsert`);
            }
        } catch (error: any) {
            // Check for unique constraint violation on email (P2002)
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                console.warn(`[WEBHOOK] Race condition detected for user ${evt.data.id}. User likely already exists by email. Retrying with update...`);
                // Optional: We could try to link the records here, but lib/user.ts handles the "link by email" logic on login.
                // For now, we just log it and don't fail the webhook.
            } else {
                console.error(`[WEBHOOK] Error processing ${eventType} for user ${id}:`, error);
                // Return 200 to Clerk so they don't retry indefinitely if it's a logic error
                // But log heavily so we can debug.
            }
            return new Response("Error processing user data", { status: 200 }); // Return 200 to prevent retries on logic errors
        }
    }

    return new Response("", { status: 200 });
}
