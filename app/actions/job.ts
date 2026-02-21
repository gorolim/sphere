"use server";

import { prisma as db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { scrapeAllSites } from "@/lib/scraper";

const DEFAULT_KEYWORDS = [
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
        
        // Use DB lists if they exist, otherwise fallback to defaults
        const validLocations = settings?.locations?.length 
            ? settings.locations 
            : ["remote", "worldwide", "anywhere", "global", "latam", "americas"];
            
        const includeEmptyLocations = settings?.includeEmptyLocations ?? true;
        const activePlatforms = settings?.platforms?.length 
            ? settings.platforms 
            : ["remotive", "jobicy", "oneforma", "greenhouse", "lever", "workable", "hiringcafe", "wttj", "vetto", "wellfound", "upwork", "alignerr", "turing", "dataannotation", "ashby", "breezyhr", "recruitee", "weworkremotely", "remoteok"];

        const excludedTerms = settings?.excludedKeywords?.length 
            ? settings.excludedKeywords 
            : ["us only", "us-only", "requires us work authorization", "us visa", "united states only"];

        const allScrapedJobs = await scrapeAllSites(activePlatforms);

        let newJobsAdded = 0;

        for (const job of allScrapedJobs) {
            const location = (job.location || "").trim().toLowerCase();
            
            let locationValid = false;
            if (location === "" && includeEmptyLocations) {
                locationValid = true;
            } else {
                locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
            }
            
            const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
            const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));

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
                            company: job.company,
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

export async function getJobSettings() {
    const settings = await db.jobSettings.findFirst();
    return { 
        data: {
            customKeywords: settings?.customKeywords || [],
            locations: settings?.locations || ["remote", "worldwide", "anywhere", "global", "latam", "americas"],
            includeEmptyLocations: settings?.includeEmptyLocations ?? true,
            platforms: settings?.platforms || ["remotive", "jobicy", "oneforma", "greenhouse", "lever", "workable", "hiringcafe", "wttj", "vetto", "wellfound", "upwork", "alignerr", "turing", "dataannotation", "ashby", "breezyhr", "recruitee", "weworkremotely", "remoteok"],
            excludedKeywords: settings?.excludedKeywords || ["us only", "us-only", "requires us work authorization", "us visa", "united states only"]
        }
    };
}

export async function updateSettingsArray(field: 'customKeywords' | 'locations' | 'excludedKeywords' | 'platforms', items: string[]) {
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
                    [field]: items
                }
            });
        } else {
            await db.jobSettings.create({
                data: {
                    [field]: items
                }
            });
        }
        return { success: true };
    } catch (e) {
        return { error: "Failed to update settings" };
    }
}

export async function updateSettingsBoolean(field: 'includeEmptyLocations', value: boolean) {
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
                    [field]: value
                }
            });
        } else {
            await db.jobSettings.create({
                data: {
                    [field]: value
                }
            });
        }
        return { success: true };
    } catch (e) {
        return { error: "Failed to update settings" };
    }
}
