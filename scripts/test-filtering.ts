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
    console.log("Fetching DB settings...");
    try {
        const settings = await db.jobSettings.findFirst();
        const customKeywords = settings?.customKeywords || [];
        const allKeywords = [...DEFAULT_KEYWORDS, ...customKeywords];
        
        console.log(`Loaded ${allKeywords.length} total keywords.`);
        
        const validLocations = settings?.locations?.length 
            ? settings.locations 
            : ["remote", "worldwide", "anywhere", "global", "latam", "americas"];
            
        const includeEmptyLocations = settings?.includeEmptyLocations ?? true;
        const activePlatforms = settings?.platforms?.length 
            ? settings.platforms 
            : ["remotive", "jobicy", "oneforma", "greenhouse", "lever", "workable", "hiringcafe", "wttj", "vetto", "wellfound", "upwork", "alignerr", "turing", "dataannotation"];

        const excludedTerms = settings?.excludedKeywords?.length 
            ? settings.excludedKeywords 
            : ["us only", "us-only", "requires us work authorization", "us visa", "united states only"];

        console.log(`Platforms to scrape: \n${activePlatforms.join(', ')}`);
        
        const allScrapedJobs = await scrapeAllSites(activePlatforms);
        console.log(`\n==========================================`);
        console.log(`Total RAW Jobs Found: ${allScrapedJobs.length}`);
        console.log(`==========================================\n`);

        let passedLocation = 0;
        let passedExclusion = 0;
        let finalJobsMatched = 0;

        for (const job of allScrapedJobs) {
            const location = (job.location || "").trim().toLowerCase();
            
            let locationValid = false;
            if (location === "" && includeEmptyLocations) {
                locationValid = true;
            } else {
                locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
            }
            
            if (locationValid) {
                passedLocation++;
            } else {
                continue;
            }
            
            const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
            const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));

            if (!hasExclusions) {
                passedExclusion++;
            } else {
                continue;
            }

            const matchedKeywords = containsKeyword(titleAndDescription, allKeywords);

            if (matchedKeywords.length > 0) {
                finalJobsMatched++;
            }
        }
        
        console.log(`--- PIPELINE FUNNEL ---`);
        console.log(`1. Jobs passing location check (Empty Allowed: ${includeEmptyLocations}): ${passedLocation} (Dropped ${allScrapedJobs.length - passedLocation})`);
        console.log(`2. Jobs passing exclusion check: ${passedExclusion} (Dropped ${passedLocation - passedExclusion})`);
        console.log(`3. FINAL JOBS saved to DB (Matching Keywords): ${finalJobsMatched} (Dropped ${passedExclusion - finalJobsMatched})`);

    } catch(e) {
        console.error(e);
    }
}

testFiltering();
