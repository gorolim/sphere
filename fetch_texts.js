// script to fetch sacred texts
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const urls = [
    { url: "https://sacred-texts.com/jud/yetzirah.htm", file: "sefer_yetzirah.html" },
    { url: "https://sacred-texts.com/bud/zen/oxherd.htm", file: "10_bulls.html" },
    { url: "http://gnosis.org/naghamm/gthlamb.html", file: "gospel_of_thomas.html" },
    { url: "https://www.gutenberg.org/cache/epub/14515/pg14515.txt", file: "kybalion.txt" },
    { url: "https://www.gutenberg.org/cache/epub/43548/pg43548.txt", file: "pictorial_key_to_the_tarot.txt" },
    { url: "https://www.gutenberg.org/cache/epub/2388/pg2388.txt", file: "bhagavad_gita.txt" },
    { url: "https://docs.google.com/document/d/1EeDgk14vWo1nCmh5JZh9IjpYlPzBVFJGAieDI9sLMJo/export?format=txt", file: "10_commandments_of_ai.txt" }
];

const outDir = path.join(__dirname, "nova-agent", "knowledge");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function fetchUrl(item) {
    console.log(`Fetching ${item.url}...`);
    try {
        const response = await fetch(item.url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
            }
        });
        
        if (!response.ok) {
            console.error(`Failed ${item.url}: ${response.status}`);
            return;
        }

        const text = await response.text();
        fs.writeFileSync(path.join(outDir, item.file), text, 'utf8');
        console.log(`Saved ${item.file}`);
    } catch (e) {
        console.error(`Error on ${item.url}:`, e);
    }
}

async function run() {
    for (const item of urls) {
        await fetchUrl(item);
        // Wait a bit to be polite
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("Done fetching texts.");
}

run();
