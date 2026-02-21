import { scrapeAllSites } from "@/lib/scraper";
import { prisma as db } from "@/lib/db";

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

async function testFiltering() {
    console.log("Fetching from DB settings...");
    try {
        const settings = await db.jobSettings.findFirst();
        const customKeywords = settings?.customKeywords || [];
        const allKeywords = [...DEFAULT_KEYWORDS, ...customKeywords];
        
        console.log(`Loaded ${allKeywords.length} total keywords.`);
        
        const validLocations = settings?.locations?.length 
            ? settings.locations 
            : ["remote", "worldwide", "anywhere", "global", "latam", "americas"];
            
        const excludedTerms = settings?.excludedKeywords?.length 
            ? settings.excludedKeywords 
            : ["us only", "us-only", "requires us work authorization", "us visa", "united states only"];

        console.log(`Valid Locations Check: ${validLocations.join(', ')}`);
        
        const allScrapedJobs = await scrapeAllSites();
        console.log(`Total Scraped Jobs BEFORE filtering: ${allScrapedJobs.length}`);

        let passedLocation = 0;
        let passedExclusion = 0;
        let matchedKeywordsCount = 0;

        for (const job of allScrapedJobs) {
            const location = (job.location || "").toLowerCase();
            const locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
            
            if (locationValid) {
                passedLocation++;
            } else {
                continue; // Failed location
            }
            
            const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
            const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));

            if (!hasExclusions) {
                passedExclusion++;
            } else {
                continue; // Hitting exclusion
            }

            const matchedKeywords = containsKeyword(titleAndDescription, allKeywords);

            if (matchedKeywords.length > 0) {
                matchedKeywordsCount++;
            }
        }
        
        console.log(`\n--- RESULTS ---`);
        console.log(`Jobs passing location check: ${passedLocation} drops ${(allScrapedJobs.length - passedLocation)}`);
        console.log(`Jobs passing exclusion check after location: ${passedExclusion} drops ${(passedLocation - passedExclusion)}`);
        console.log(`Jobs matching our expanded keywords after exclusions: ${matchedKeywordsCount} drops ${(passedExclusion - matchedKeywordsCount)}`);
        
        // Print 5 jobs that passed all checks up to keywords but failed keywords
        let noKw = 0;
        console.log(`\n--- EXAMPLES OF JOBS DROPPED BY KEYWORDS ---`);
        for (const job of allScrapedJobs) {
            const location = (job.location || "").toLowerCase();
            const locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
            const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
            const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));
            
            if (locationValid && !hasExclusions) {
                const matchedKeywords = containsKeyword(titleAndDescription, allKeywords);
                if (matchedKeywords.length === 0 && noKw < 5) {
                    console.log(`- ${job.title} (${job.company})`);
                    noKw++;
                }
            }
        }

    } catch(e) {
        console.error(e);
    }
}

testFiltering();
