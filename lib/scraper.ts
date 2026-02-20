// lib/scraper.ts

export interface ScrapedJob {
    title: string;
    company: string;
    url: string;
    description: string;
    location: string;
}

/**
 * The master scraping brain. 
 * Orchestrates calls to individual company adapters (e.g. Outlier, DataAnnotation).
 */
export async function scrapeAllSites(): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = [];
    
    try {
        console.log("Starting unified Scraper Service...");

        // Open APIs
        const jobicyJobs = await fetchJobicy();
        allJobs.push(...jobicyJobs);
        
        const remotiveJobs = await fetchRemotive();
        allJobs.push(...remotiveJobs);

        console.log(`Scraper Service completed. Total raw jobs fetched: ${allJobs.length}`);
    } catch (e) {
        console.error("Error in master scraper orchestration:", e);
    }
    
    return allJobs;
}

// ==========================================
// INDIVIDUAL SITE ADAPTERS WILL GO BELOW
// ==========================================

async function fetchRemotive(): Promise<ScrapedJob[]> {
    try {
        const res = await fetch("https://remotive.com/api/remote-jobs");
        const data = await res.json();
        return (data.jobs || []).map((j: any) => ({
            title: j.title || "",
            company: j.company_name || "",
            url: j.url || "",
            description: j.description || "",
            location: j.candidate_required_location || ""
        }));
    } catch (e) {
        console.error("Remotive fetch failed", e);
        return [];
    }
}

async function fetchJobicy(): Promise<ScrapedJob[]> {
    try {
        // Fetch 50 most recent remote jobs from Jobicy
        const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=50");
        const data = await res.json();
        return (data.jobs || []).map((j: any) => ({
            title: j.jobTitle || "",
            company: j.companyName || "",
            url: j.url || "",
            description: j.jobDescription || "",
            location: j.jobGeo || ""
        }));
    } catch (e) {
        console.error("Jobicy fetch failed", e);
        return [];
    }
}
