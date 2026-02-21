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
    // Strategy: Greenhouse provides a public JSON API for companies boards
    const companies = ['scaleai', 'anthropic', 'openai'];
    const jobs: ScrapedJob[] = [];
    
    for (const company of companies) {
        try {
            const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);
            if (!res.ok) continue;
            const data = await res.json();
            
            if (data && data.jobs) {
                for (const j of data.jobs) {
                    jobs.push({
                        title: j.title || "",
                        company: company.toUpperCase(),
                        url: j.absolute_url || "",
                        description: j.title || "", // Greenhouse requires a second API call for description, keeping it light
                        location: (j.location?.name || "") + " Remote"
                    });
                }
            }
        } catch (e) {
            console.error(`Greenhouse fetch failed for ${company}`, e);
        }
    }
    return jobs;
}

async function fetchLever(): Promise<ScrapedJob[]> {
    // Strategy: Lever provides a public JSON API
    const companies = ['surgeai', 'cohere'];
    const jobs: ScrapedJob[] = [];
    
    for (const company of companies) {
        try {
            const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
            if (!res.ok) continue;
            const data = await res.json();
            
            if (Array.isArray(data)) {
                for (const j of data) {
                    jobs.push({
                        title: j.text || "",
                        company: company.toUpperCase(),
                        url: j.hostedUrl || "",
                        description: j.descriptionPlain || "",
                        location: (j.categories?.location || "Remote")
                    });
                }
            }
        } catch (e) {
             console.error(`Lever fetch failed for ${company}`, e);
        }
    }
    return jobs;
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
    // Strategy: Upwork RSS Feeds
    const queries = ["AI+Training", "RLHF", "Data+Annotation", "Prompt+Engineering"];
    const jobs: ScrapedJob[] = [];
    
    for (const query of queries) {
        try {
            const res = await fetch(`https://www.upwork.com/ab/feed/jobs/rss?q=${query}&sort=recency`, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
            });
            if (!res.ok) continue;
            
            const text = await res.text();
            const $ = cheerio.load(text, { xmlMode: true });
            
            $('item').each((i, el) => {
                const title = $(el).find('title').text() || "";
                const link = $(el).find('link').text() || "";
                const description = $(el).find('description').text() || "";
                
                if(!jobs.some(j => j.url === link)) {
                    jobs.push({
                        title: title.replace(" - Upwork", ""),
                        company: "Upwork Client",
                        url: link,
                        description: description.substring(0, 1000), // Keep it trim
                        location: "Worldwide / Remote"
                    });
                }
            });
        } catch (e) {
            console.error(`Upwork fetch failed for query ${query}`, e);
        }
    }
    return jobs;
}

async function fetchAlignerr(): Promise<ScrapedJob[]> {
    return [];
}

async function fetchTuring(): Promise<ScrapedJob[]> {
    return [];
}
