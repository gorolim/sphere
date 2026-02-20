const urls = [
    "https://hiring.cafe/",
    "https://app.welcometothejungle.com/",
    "https://work.vetto.ai/",
    "https://www.oneforma.com/"
];

async function checkUrl(url) {
    try {
        console.log(`\n--- Fetching ${url} ---`);
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Body Length: ${text.length}`);
        
        // Check for common Next.js / Nuxt data attributes
        if (text.includes('__NEXT_DATA__')) console.log('Contains Next.js data');
        if (text.includes('window.__NUXT__')) console.log('Contains Nuxt data');
        
        // Print snippet
        console.log(`Snippet: ${text.substring(0, 150).replace(/\\n/g, '')}...`);
    } catch (e) {
        console.error(`Failed to fetch ${url}`, e);
    }
}

async function run() {
    for (const u of urls) {
        await checkUrl(u);
    }
}

run();
