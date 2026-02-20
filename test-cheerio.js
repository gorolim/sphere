const cheerio = require('cheerio');

async function checkOneForma() {
    console.log("--- ONEFORMA ---");
    try {
        const res = await fetch("https://www.oneforma.com/", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const text = await res.text();
        const $ = cheerio.load(text);
        
        let links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const txt = $(el).text().trim();
            if (href && (href.includes('job') || href.includes('project'))) {
                links.push({ text: txt, href });
            }
        });
        
        console.log(`Found ${links.length} job-related links.`);
        console.log(links.slice(0, 5));
    } catch(e) { console.error(e); }
}

async function checkWTTJ() {
    console.log("\n--- WELCOME TO THE JUNGLE ---");
    try {
        // Let's try their algolia API or public jobs API
        const res = await fetch("https://api.welcometothejungle.com/api/v1/jobs?page=1&per_page=5", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        console.log("Status:", res.status);
        if(res.status === 200) {
           const data = await res.json();
           console.log("Jobs found in WTTJ API:", data.jobs ? data.jobs.length : "None");
        } else {
           console.log("API might be protected or requires keys.");
        }
    } catch(e) { console.error(e); }
}

async function run() {
    await checkOneForma();
    await checkWTTJ();
}
run();
