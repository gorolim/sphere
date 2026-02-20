import { scrapeAllSites } from './lib/scraper';

const DEFAULT_KEYWORDS = [
  "RLHF", "AI Tutor", "Data Annotation", "Labeling", "Red Teaming", 
  "Adversarial Testing", "Prompt Engineering", "Search Quality Rater", 
  "Ads Assessment", "Dataset Curation", "Phonetic Transcription", 
  "n8n", "AI Evaluator", "Audio Training", "Video Training", 
  "Image Training", "Audio Annotation", "Video Annotation", 
  "Image Annotation", "Portuguese", "Spanish"
];

const customKeywords = ["engineer", "marketing"];
const allKeywords = [...DEFAULT_KEYWORDS, ...customKeywords];

const validLocations = ["remote", "worldwide", "anywhere", "global", "latam", "americas"];
const excludedTerms = ["us only", "us-only", "requires us work authorization", "us visa", "united states only"];

const containsKeyword = (text: string, keywords: string[]): string[] => {
    const textLower = text.toLowerCase();
    return keywords.filter(kw => textLower.includes(kw.toLowerCase()));
};

async function run() {
    const allScrapedJobs = await scrapeAllSites();
    console.log(`\nTotal jobs scraped across all platforms: ${allScrapedJobs.length}`);

    let passedFilters = 0;

    for (const job of allScrapedJobs) {
        const location = (job.location || "").toLowerCase();
        const locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
        
        const titleAndDescription = ((job.title || "") + " " + (job.description || "")).toLowerCase();
        const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));

        if (!locationValid || hasExclusions) continue;

        const matchedKeywords = containsKeyword(titleAndDescription, allKeywords);

        if (matchedKeywords.length > 0) {
            passedFilters++;
            console.log(`MATCHED [${matchedKeywords.join(', ')}]: ${job.title.substring(0, 50)} at ${job.company}`);
        }
    }

    console.log(`\nFinal count passing Location AND Exclusion AND Keywords: ${passedFilters}`);
}
run();
