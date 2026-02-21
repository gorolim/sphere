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
export async function scrapeAllSites(activePlatforms: string[] = []): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = [];
    
    try {
        console.log(`Starting unified Scraper Service for platforms: ${activePlatforms.join(', ')}...`);

        const platformMap: Record<string, () => Promise<ScrapedJob[]>> = {
            "jobicy": fetchJobicy,
            "remotive": fetchRemotive,
            "oneforma": fetchOneForma,
            "greenhouse": fetchGreenhouse,
            "lever": fetchLever,
            "workable": fetchWorkable,
            "hiringcafe": fetchHiringCafe,
            "wttj": fetchWttj,
            "vetto": fetchVetto,
            "wellfound": fetchWellfound,
            "upwork": fetchUpwork,
            "alignerr": fetchAlignerr,
            "turing": fetchTuring,
        };

        for (const platform of activePlatforms) {
            const fetchFn = platformMap[platform.toLowerCase()];
            if (fetchFn) {
                console.log(`Fetching from ${platform}...`);
                const jobs = await fetchFn();
                allJobs.push(...jobs);
            } else {
                console.warn(`Scraper for platform '${platform}' not found.`);
            }
        }

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

async function fetchGreenhouse(): Promise<ScrapedJob[]> {
    // Strategy: Greenhouse boards are nested under boards.greenhouse.io
    // Since we need a specific company, we'll return an empty array for now 
    // to prevent crashes, as it requires a specific company board token (like scaleai)
    return [];
}

async function fetchLever(): Promise<ScrapedJob[]> {
    // Strategy: Lever jobs are at jobs.lever.co/{company}
    return [];
}

async function fetchWorkable(): Promise<ScrapedJob[]> {
    // Strategy: Workable aggregator APIs
    return [];
}

async function fetchHiringCafe(): Promise<ScrapedJob[]> {
    // Hiring.cafe is a heavily JS injected site. We safely return empty list 
    // until headless browser scraping is set up via n8n.
    return [];
}

async function fetchWttj(): Promise<ScrapedJob[]> {
    // Welcome to the jungle has Algolia APIs.
    return [];
}

async function fetchVetto(): Promise<ScrapedJob[]> {
    return [];
}

async function fetchWellfound(): Promise<ScrapedJob[]> {
    return [];
}

async function fetchUpwork(): Promise<ScrapedJob[]> {
    // Strategy: Upwork RSS Feed parsing can be implemented here.
    return [];
}

async function fetchAlignerr(): Promise<ScrapedJob[]> {
    return [];
}

async function fetchTuring(): Promise<ScrapedJob[]> {
    return [];
}
