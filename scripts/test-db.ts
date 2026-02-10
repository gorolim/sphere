
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        // Attempt to connect
        await prisma.$connect();
        console.log('✅ Successfully connected to the database.');

        // Check for Users table
        const userCount = await prisma.user.count();
        console.log(`✅ User Table accessible. Count: ${userCount}`);

        // Check for Agents table
        const agentCount = await prisma.agent.count();
        console.log(`✅ Agent Table accessible. Count: ${agentCount}`);

        // Check for Posts table
        const postCount = await prisma.post.count();
        console.log(`✅ Post Table accessible. Count: ${postCount}`);

    } catch (error) {
        console.error('❌ Connection or Query Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
