import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️  DATABASE_URL is missing from environment variables. Prisma will fail to connect at runtime.');
    } else {
        console.log(`[PRISMA] Connecting to ${process.env.DATABASE_URL.split('@')[1] || 'DB'}...`);
    }
    return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
