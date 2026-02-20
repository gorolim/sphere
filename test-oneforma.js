const cheerio = require('cheerio');

async function checkOneForma() {
    console.log("--- ONEFORMA JOBS PAGE ---");
    try {
        const res = await fetch("https://www.oneforma.com/jobs/", {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const text = await res.text();
        const $ = cheerio.load(text);
        
        let jobs = [];
        // Typically job boards use class names like 'job', 'card', 'listing'
        $('.elementor-widget-wrap article, .job-listing, .post').each((i, el) => {
            const titleElement = $(el).find('h2, h3, .job-title, a');
            let title = titleElement.text().trim();
            
            // Try to find the link
            let href = $(el).find('a').attr('href');
            if(!href && $(el).is('a')) {
                 href = $(el).attr('href');
            }
            // Some clean up specifically for OneForma themes
            if (title && href && title.length > 3) {
                // To avoid duplicate or weird tags, let's keep only if valid URL
                if(href.includes('jobs/') && !jobs.some(j => j.url === href)) {
                    jobs.push({
                        title: title.replace(/\s+/g, ' ').substring(0, 100),
                        url: href
                    });
                }
            }
        });

        // If simple selectors fail, try generic link extraction
        if (jobs.length === 0) {
            console.log("Specific selectors failed. Extracting generic links...");
            $('a[href*="/jobs/"]').each((i, el) => {
                const title = $(el).text().trim().replace(/\s+/g, ' ');
                const href = $(el).attr('href');
                if (title && title.length > 5 && !title.toLowerCase().includes('read more')) {
                    if(!jobs.some(j => j.url === href)) {
                        jobs.push({ title, url: href });
                    }
                }
            });
        }
        
        console.log(`Successfully parsed ${jobs.length} jobs.`);
        console.log(jobs.slice(0, 10));
    } catch(e) { console.error(e); }
}

checkOneForma();
