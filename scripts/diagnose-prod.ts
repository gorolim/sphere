
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log("---------------------------------------------------------");
    console.log("   THE ENGINE SPHERE - PRODUCTION DIAGNOSTICS");
    console.log("---------------------------------------------------------");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("❌ CRITICAL: DATABASE_URL is missing from environment.");
        process.exit(1);
    }

    console.log(`✅ DATABASE_URL found: ${dbUrl.replace(/:[^:]+@/, ':****@')}`);

    const prisma = new PrismaClient();

    try {
        console.log("\n📡 Testing Database Connection...");
        const start = Date.now();
        await prisma.$connect();
        const latency = Date.now() - start;
        console.log(`✅ Connection Established! Latency: ${latency}ms`);

        // Check Users
        console.log("\n👥 Analyzing User Registry...");
        const userCount = await prisma.user.count();
        console.log(`   Total Users: ${userCount}`);

        const adminEmail = process.env.MASTER_ADMIN_EMAIL;
        if (adminEmail) {
            console.log(`\n👑 Checking Master Admin (${adminEmail})...`);
            const admin = await prisma.user.findUnique({
                where: { email: adminEmail }
            });

            if (admin) {
                console.log(`   ✅ Master Admin Found!`);
                console.log(`      ID: ${admin.id}`);
                console.log(`      Role: ${admin.role}`);
                console.log(`      Clerk ID: ${admin.clerkId}`);
            } else {
                console.error(`   ❌ Master Admin NOT FOUND in database.`);
            }
        } else {
            console.warn("\n⚠️  MASTER_ADMIN_EMAIL not set in environment.");
        }

        // List recent users
        console.log("\n📝 Last 5 Users:");
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, email: true, clerkId: true, role: true, createdAt: true }
        });

        recentUsers.forEach(u => {
            console.log(`   - [${u.role}] ${u.email} (Clerk: ${u.clerkId}) - ${u.createdAt.toISOString()}`);
        });

    } catch (e) {
        console.error("\n❌ DIAGNOSTIC FAILURE:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
