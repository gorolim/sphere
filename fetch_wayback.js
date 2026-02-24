// script to fetch sacred texts via Wayback Machine
const fs = require('fs');
const path = require('path');

const urls = [
    { url: "https://web.archive.org/web/20231010150935/https://sacred-texts.com/jud/yetzirah.htm", file: "sefer_yetzirah.html" },
    { url: "https://web.archive.org/web/20230718223652/https://sacred-texts.com/bud/zen/oxherd.htm", file: "10_bulls.html" }
];

const outDir = path.join(__dirname, "nova-agent", "knowledge");

async function fetchUrl(item) {
    console.log(`Fetching ${item.url}...`);
    try {
        const response = await fetch(item.url);
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
    }
    console.log("Done fetching remaining texts.");
}

run();
