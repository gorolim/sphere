"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export async function updateProfile(data: {
    username: string;
    socialHandles: any;
    rawAboutMe: string;
    rawPortfolio: string;
}) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        // Validate uniqueness of username if it changed
        const existing = await prisma.user.findUnique({
            where: { username: data.username.toLowerCase() }
        });

        if (existing && existing.id !== user.id) {
            return { error: "Username is already claimed by another agent." };
        }

        let newScore = 1; // Base setup complete

        // Rough calculation of onboarding score
        if (data.username) newScore += 1; // Phase 1
        if (data.socialHandles?.twitter || data.socialHandles?.linkedin) newScore += 1; // Phase 2
        if (data.rawAboutMe && data.rawAboutMe.length > 10) newScore += 1; // Phase 3
        if (data.rawPortfolio && data.rawPortfolio.length > 10) newScore += 1; // Phase 4
        
        // Fetch existing score to never regress
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
        const currentScore = dbUser?.onboardingScore || 0;

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                username: data.username.toLowerCase(),
                socialHandles: data.socialHandles,
                rawAboutMe: data.rawAboutMe,
                rawPortfolio: data.rawPortfolio,
                onboardingScore: Math.max(newScore, currentScore)
            }
        });

        return { success: true, user: updated };

    } catch (e: any) {
        console.error("Profile update error:", e);
        return { error: "Failed to integrate profile into the Mainframe." };
    }
}
