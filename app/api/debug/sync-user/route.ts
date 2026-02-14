
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "No email found" }, { status: 400 });
        }

        console.log(`[FORCE_SYNC] Attempting for ${clerkUser.id} (${email})`);

        // 1. Check existing by ID
        let user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
        if (user) {
            return NextResponse.json({ status: "success", message: "User already exists", user });
        }

        // 2. Check existing by Email
        const existingByEmail = await prisma.user.findUnique({ where: { email } });

        const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
            email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();

        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email.split('@')[0];

        try {
            if (existingByEmail) {
                console.log(`[FORCE_SYNC] Updating existing email user`);
                user = await prisma.user.update({
                    where: { id: existingByEmail.id },
                    data: {
                        clerkId: clerkUser.id,
                        name: existingByEmail.name || name,
                        role: isMasterAdmin ? "admin" : existingByEmail.role,
                        isPro: isMasterAdmin ? true : existingByEmail.isPro
                    }
                });
            } else {
                console.log(`[FORCE_SYNC] Creating new user`);
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

            return NextResponse.json({ status: "success", user });

        } catch (dbError: any) {
            console.error(`[FORCE_SYNC] DB Error:`, dbError);
            return NextResponse.json({
                status: "error",
                message: dbError.message,
                code: dbError.code,
                meta: dbError.meta
            }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
