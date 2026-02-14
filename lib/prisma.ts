import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is missing from environment variables');
    }
    console.log(`[PRISMA] Connecting to ${process.env.DATABASE_URL.split('@')[1] || 'DB'}...`);
    return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
