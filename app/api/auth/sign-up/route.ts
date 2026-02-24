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

        const hashedPassword = await hashPassword(password);
        let userToAuth;

        if (existingUser) {
            // [ZERO-FRICTION MIGRATION] Support upgrading legacy Clerk users who do not have a Native password
            if (existingUser.email === email && !existingUser.passwordHash) {
                userToAuth = await prisma.user.update({
                    where: { email },
                    data: {
                        passwordHash: hashedPassword,
                        username: username || existingUser.username || email.split("@")[0],
                        name: name || existingUser.name || ""
                    }
                });
            } else {
                return NextResponse.json({ error: "Identity conflict detected. Email or username already claimed." }, { status: 400 });
            }
        } else {
            userToAuth = await prisma.user.create({
                data: {
                    email,
                    username: username || email.split("@")[0],
                    name: name || "",
                    passwordHash: hashedPassword,
                },
            });
        }

        // Generate JWT and set cookie
        const token = await signToken({ userId: userToAuth.id });
        await setSessionCookie(token);

        return NextResponse.json({ success: true, user: userToAuth });
    } catch (error) {
        console.error("Sign-up Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
