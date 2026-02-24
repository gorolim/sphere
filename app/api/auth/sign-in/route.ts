import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Generate JWT and set cookie
        const token = await signToken({ userId: user.id });
        await setSessionCookie(token);

        const isMasterAdmin = process.env.MASTER_ADMIN_EMAIL &&
            user.email.toLowerCase() === process.env.MASTER_ADMIN_EMAIL.toLowerCase();
        const redirectUrl = isMasterAdmin ? "/master-admin" : "/dashboard";

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username }, redirectUrl });
    } catch (error) {
        console.error("Sign-in Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE() {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
}
