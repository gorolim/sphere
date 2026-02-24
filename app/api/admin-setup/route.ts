import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
    try {
        const email = "rrolim.rafael@gmail.com";
        const passwordHash = await hashPassword("admin123");

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash,
                role: "admin",
                name: "Master Architect"
            },
            create: {
                email,
                passwordHash,
                role: "admin",
                name: "Master Architect",
                username: "rrolim"
            }
        });

        return NextResponse.json({ success: true, message: `Admin user ${user.email} updated successfully.` });
    } catch (error) {
        console.error("Setup Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
