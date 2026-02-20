// lib/scraper.ts
import * as cheerio from 'cheerio';

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
        
        const oneformaJobs = await fetchOneForma();
        allJobs.push(...oneformaJobs);

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

async function fetchOneForma(): Promise<ScrapedJob[]> {
    try {
        console.log("Fetching OneForma HTML...");
        const res = await fetch("https://www.oneforma.com/jobs/", {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const text = await res.text();
        const $ = cheerio.load(text);
        
        const jobs: ScrapedJob[] = [];
        
        $('a[href*="/jobs/"]').each((i, el) => {
            const rawText = $(el).text().trim().replace(/\s+/g, ' ');
            const href = $(el).attr('href') || "";
            
            // Filter out pagination links and UI buttons
            if (rawText && rawText.length > 15 && !rawText.toLowerCase().includes('read more') && !href.includes('/page/')) {
                if(!jobs.some(j => j.url === href)) {
                    jobs.push({
                        title: rawText.substring(0, 80) + "...", // The text includes the description, so we use it as the title and description
                        company: "OneForma",
                        url: href,
                        description: rawText,
                        location: "Worldwide / Remote"
                    });
                }
            }
        });
        
        return jobs;
    } catch (e) {
        console.error("OneForma fetch failed", e);
        return [];
    }
}
