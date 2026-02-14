import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json({
                status: "error",
                message: "Not logged in to Clerk",
                clerkUser: null
            });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id }
        });

        // Test DB connection with a simple count
        const userCount = await prisma.user.count();

        return NextResponse.json({
            status: "ok",
            clerk: {
                id: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress,
                firstName: clerkUser.firstName
            },
            database: {
                connected: true,
                userFound: !!dbUser,
                userRole: dbUser?.role,
                totalUsers: userCount
            },
            env: {
                // Don't expose full keys, just check existence
                hasDbUrl: !!process.env.DATABASE_URL,
                hasMasterAdmin: !!process.env.MASTER_ADMIN_EMAIL,
                masterAdminEmail: process.env.MASTER_ADMIN_EMAIL
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
