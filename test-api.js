const DEFAULT_KEYWORDS = [
  "RLHF", "AI Tutor", "Data Annotation", "Labeling", "Red Teaming", 
  "Adversarial Testing", "Prompt Engineering", "Search Quality Rater", 
  "Ads Assessment", "Dataset Curation", "Phonetic Transcription", 
  "n8n", "AI Evaluator", "Audio Training", "Video Training", 
  "Image Training", "Audio Annotation", "Video Annotation", 
  "Image Annotation", "Portuguese", "Spanish"
];

async function fetchFromRemotive() {
    try {
        const res = await fetch("https://remotive.com/api/remote-jobs");
        const data = await res.json();
        return (data.jobs || []).map(j => ({
            title: j.title || "",
            company: j.company_name || "",
            url: j.url || "",
            description: j.description || "",
            location: j.candidate_required_location || ""
        }));
    } catch { return []; }
}

async function fetchFromJobicy() {
    try {
        const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=50");
        const data = await res.json();
        return (data.jobs || []).map(j => ({
            title: j.jobTitle || "",
            company: j.companyName || "",
            url: j.url || "",
            description: j.jobDescription || "",
            location: j.jobGeo || ""
        }));
    } catch { return []; }
}

async function run() {
    const remotiveJobs = await fetchFromRemotive();
    console.log(`Remotive returned ${remotiveJobs.length} total jobs.`);
    const jobicyJobs = await fetchFromJobicy();
    console.log(`Jobicy returned ${jobicyJobs.length} total jobs.`);

    const allJobs = [...remotiveJobs, ...jobicyJobs];
    console.log(`Total jobs fetched from APIs: ${allJobs.length}`);

    const validLocations = ["remote", "worldwide", "anywhere", "global", "latam", "americas"];
    const excludedTerms = ["us only", "us-only", "requires us work authorization", "us visa", "united states only"];

    let passedFilters = 0;
    for (const job of allJobs) {
        const location = job.location.toLowerCase();
        const locationValid = validLocations.some(loc => location.includes(loc.toLowerCase()));
        
        const titleAndDescription = (job.title + " " + job.description).toLowerCase();
        const hasExclusions = excludedTerms.some(excl => titleAndDescription.includes(excl.toLowerCase()));

        if (!locationValid || hasExclusions) continue;

        const matchedKeywords = DEFAULT_KEYWORDS.filter(kw => titleAndDescription.includes(kw.toLowerCase()));
        if (matchedKeywords.length > 0) {
            passedFilters++;
        }
    }

    console.log(`Passed all filtering & keywords: ${passedFilters}`);
}
run();
