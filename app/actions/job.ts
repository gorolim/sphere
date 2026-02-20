"use server";

import { prisma as db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";const DEFAULT_KEYWORDS = [
  "RLHF", "AI Tutor", "Data Annotation", "Labeling", "Red Teaming", 
  "Adversarial Testing", "Prompt Engineering", "Search Quality Rater", 
  "Ads Assessment", "Dataset Curation", "Phonetic Transcription", 
  "n8n", "AI Evaluator", "Audio Training", "Video Training", 
  "Image Training", "Audio Annotation", "Video Annotation", 
  "Image Annotation", "Portuguese", "Spanish"
];

const containsKeyword = (text: string, keywords: string[]): string[] => {
    const textLower = text.toLowerCase();
    return keywords.filter(kw => textLower.includes(kw.toLowerCase()));
};

export async function getJobs() {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser || dbUser.role !== "admin") {
        return { error: "Unauthorized", role: dbUser?.role };
    }

    const jobs = await db.job.findMany({
        where: { isHidden: false },
        orderBy: { createdAt: "desc" },
    });

    return { data: jobs };
}

export async function fetchAndSyncJobs() {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser || dbUser.role !== "admin") {
        return { error: "Unauthorized" };
    }

    try {
        const settings = await db.jobSettings.findFirst();
        const customKeywords = settings?.customKeywords || [];
        const allKeywords = [...DEFAULT_KEYWORDS, ...customKeywords];

        const response = await fetch("https://remotive.com/api/remote-jobs?category=software-dev,data,writing");
        if (!response.ok) {
           return { error: "Failed to fetch from Remotive API" };
        }
        
        const data = await response.json();
        const jobs = data.jobs || [];

        let newJobsAdded = 0;

        for (const job of jobs) {
            const location = (job.candidate_required_location || "").toLowerCase();
            const locationValid = ["remote", "worldwide", "anywhere", "global", "latam", "americas"].some(loc => location.includes(loc));
            
            const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
            const hasExclusions = ["us only", "us-only", "requires us work authorization", "us visa", "united states only"].some(excl => titleAndDescription.includes(excl));

            if (!locationValid || hasExclusions) continue;

            const matchedKeywords = containsKeyword(titleAndDescription, allKeywords);

            if (matchedKeywords.length > 0) {
                const existing = await db.job.findFirst({
                    where: { url: job.url }
                });

                if (!existing) {
                    await db.job.create({
                        data: {
                            title: job.title,
                            company: job.company_name,
                            url: job.url,
                            keywords: matchedKeywords,
                            status: "discovered",
                        }
                    });
                    newJobsAdded++;
                }
            }
        }
        
        return { success: true, count: newJobsAdded };

    } catch (e: any) {
        console.error("Error fetching jobs:", e);
        return { error: e.message || "Failed to sync jobs" };
    }
}

export async function updateJobStatus(jobId: string, newStatus: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await db.job.update({
            where: { id: jobId },
            data: { status: newStatus }
        });
        return { success: true };
    } catch(e) {
        return { error: "Failed to update job status" };
    }
}

export async function hideJob(jobId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await db.job.update({
            where: { id: jobId },
            data: { isHidden: true }
        });
        return { success: true };
    } catch(e) {
        return { error: "Failed to hide job" };
    }
}

export async function getCustomKeywords() {
    const settings = await db.jobSettings.findFirst();
    return { data: settings?.customKeywords || [] };
}

export async function addCustomKeyword(keyword: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    
    // Auth role check...
    const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
    });
    if (!dbUser || dbUser.role !== "admin") return { error: "Unauthorized" };

    try {
        const settings = await db.jobSettings.findFirst();
        if (settings) {
            if (settings.customKeywords.includes(keyword)) {
                return { success: true };
            }
            await db.jobSettings.update({
                where: { id: settings.id },
                data: {
                    customKeywords: {
                        push: keyword
                    }
                }
            });
        } else {
            await db.jobSettings.create({
                data: {
                    customKeywords: [keyword]
                }
            });
        }
        return { success: true };
    } catch (e) {
        return { error: "Failed to add keyword" };
    }
}

export async function removeCustomKeyword(keyword: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    
    const dbUser = await db.user.findUnique({
        where: { clerkId: userId },
    });
    if (!dbUser || dbUser.role !== "admin") return { error: "Unauthorized" };

    try {
        const settings = await db.jobSettings.findFirst();
        if (settings) {
            await db.jobSettings.update({
                where: { id: settings.id },
                data: {
                    customKeywords: settings.customKeywords.filter(k => k !== keyword)
                }
            });
        }
        return { success: true };
    } catch (e) {
        return { error: "Failed to remove keyword" };
    }
}
