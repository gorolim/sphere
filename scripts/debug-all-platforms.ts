import { scrapeAllSites } from "@/lib/scraper";

const userKeywords = [
"RLHF", "AI Tutor", "Data Annotation", "Red Teaming", "Adversarial Testing", "Search Quality Rater", "Prompt Engineering", "Ads Assessment", "Dataset Curation", "Phonetic Transcription", "n8n", "Automation", "AI Evaluator", "Audio Training", "Video Training", "Image Training", "Audio Annotation", "Video Annotation", "Image Annotation", "Portuguese", "Spanish", "Machine Learning", "Artificial Intelligence", "Gaming", "Gaming AI", "Narrative Design", "Storytelling", "Game Development", "Conversational AI", "World Building", "Game Design", "Labeling", "vibe coding", "agentic dev", "web scraping", "data extraction", "bilingual operations", "content specialist"
];

const userLocations = [
"remote", "worldwide", "anywhere", "global", "latam", "americas", "south america", "brazil", "brasil", "florianopolis", "santa catarina", "sc", "null", "world", "everywhere"
];

const userExclusions = [
"us only", "us-only", "requires us work authorization", "us visa", "united states only", "us-based", "Must reside in the US", "US Citizenship", "Require US Work Autorization", "W2 Only", "No C2C", "Security Clearance"
];

const all18Platforms = [
"remotive", "jobicy", "oneforma", "greenhouse", "lever", "workable", "hiringcafe", "wttj", "vetto", "wellfound", "upwork", "alignerr", "turing", "dataannotation", "ashby", "breezyhr", "recruitee", "weworkremotely", "remoteok"
];

const containsKeyword = (text: string, keywords: string[]): string[] => {
    const textLower = text.toLowerCase();
    return keywords.filter(kw => textLower.includes(kw.toLowerCase()));
};

async function run() {
    console.log(`Simulating User Request with ALL ${all18Platforms.length} platforms...`);
    const allScrapedJobs = await scrapeAllSites(all18Platforms);
    
    let passedLocation = 0;
    let passedExclusion = 0;
    let finalJobs = 0;

    for (const job of allScrapedJobs) {
        const location = (job.location || "").trim().toLowerCase();
        let locationValid = false;
        
        if (location === "") {
            locationValid = true; 
        } else {
            locationValid = userLocations.some(loc => location.includes(loc.toLowerCase()));
        }

        if (locationValid) passedLocation++;
        else continue;

        const titleAndDesc = ((job.title || "") + " " + (job.description || "")).toLowerCase();
        const hasExclusions = userExclusions.some(ex => titleAndDesc.includes(ex.toLowerCase()));

        if (!hasExclusions) passedExclusion++;
        else continue;

        const matchedKw = containsKeyword(titleAndDesc, userKeywords);
        if (matchedKw.length > 0) finalJobs++;
    }

    console.log(`\n--- ALL 18 ENGINES FUNNEL SIMULATION ---`);
    console.log(`Raw from their platforms: ${allScrapedJobs.length}`);
    console.log(`Passed Location (assuming empty=true): ${passedLocation}`);
    console.log(`Passed Exclusion: ${passedExclusion}`);
    console.log(`Final Job Count using exact filters on 18 engines: ${finalJobs}`);
}

run();
