
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address.");
        console.log("Usage: node scripts/promote-admin.js <email>");
        process.exit(1);
    }

    console.log(`Searching for user with email: ${email}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error("User not found!");
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.id}). Current Role: ${user.role}`);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                role: "admin",
                isPro: true
            }
        });

        console.log("--------------------------------------------------");
        console.log(`SUCCESS! User ${updatedUser.email} is now an ADMIN.`);
        console.log("--------------------------------------------------");

    } catch (error) {
        console.error("Error promoting user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
