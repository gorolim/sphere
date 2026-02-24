import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const email = "rrolim.rafael@gmail.com";
    const password = "admin";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role: "admin",
            username: "MasterAdmin"
        },
        create: {
            email,
            passwordHash,
            role: "admin",
            username: "MasterAdmin"
        }
    });

    console.log(`Successfully updated admin user: ${user.email} with password: ${password}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
