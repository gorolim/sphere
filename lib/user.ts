import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { getSessionUserId } from "@/lib/auth";

export async function getCurrentUser(): Promise<User | null> {
    try {
        const nativeUserId = await getSessionUserId();
        
        if (!nativeUserId) return null;

        const nativeUser = await prisma.user.findUnique({
            where: { id: nativeUserId }
        });
        
        return nativeUser || null;
    } catch (error) {
        console.error("[GET_CURRENT_USER] Native Access Error:", error);
        return null;
    }
}
