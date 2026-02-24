import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password, username, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username: username || undefined }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email or username" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                username: username || email.split("@")[0],
                name: name || "",
                passwordHash: hashedPassword,
            },
        });

        // Generate JWT and set cookie
        const token = await signToken({ userId: newUser.id });
        await setSessionCookie(token);

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        console.error("Sign-up Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
