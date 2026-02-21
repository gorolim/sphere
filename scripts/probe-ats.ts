const companies = [
    'huggingface', 'snorkel', 'labelbox', 'wandb', 'invisibletechnologies', 'invisible',
    'appen', 'telus', 'rws', 'centific', 'turing', 'alignerr', 'outlier', 'mindrift',
    'databricks', 'glean', 'nexus', 'baseten', 'replicate', 'pinecone', 'together',
    'modal', 'runway', 'midjourney', 'stabilityai', 'inflection', 'characterai', 'adept',
    'anthropic', 'openai', 'scaleai', 'surgeai', 'welocalize', 'cohere', 'ai21',
    'coreweave', 'lambda', 'blandai', 'synthesis', 'descript', 'synthesia', 'elevenlabs',
    'gretel', 'snips', 'xai', 'mistral', 'perry', 'copyai', 'jasper', 'mutiny'
];

async function probeGreenhouse(company: string) {
    try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.jobs && data.jobs.length > 0) {
                console.log(`[GREENHOUSE] ✅ ${company} (${data.jobs.length} jobs)`);
                return company;
            }
        }
    } catch (e) {}
    return null;
}

async function probeLever(company: string) {
    try {
        const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log(`[LEVER]      ✅ ${company} (${data.length} jobs)`);
                return company;
            }
        }
    } catch (e) {}
    return null;
}

async function probeWorkable(company: string) {
    try {
        const res = await fetch(`https://apply.workable.com/api/v3/accounts/${company}/jobs`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.results && data.results.length > 0) {
               console.log(`[WORKABLE]   ✅ ${company} (${data.results.length} jobs)`);
               return company;
            }
        }
    } catch (e) {}
    return null;
}

async function run() {
    console.log(`Probing ${companies.length} potential AI companies across 3 ATS APIs...`);
    const validGreenhouse = [];
    const validLever = [];
    const validWorkable = [];

    const promises = companies.map(async (c) => {
        const g = await probeGreenhouse(c);
        if (g) validGreenhouse.push(g);
        
        const l = await probeLever(c);
        if (l) validLever.push(l);

        const w = await probeWorkable(c);
        if (w) validWorkable.push(w);
    });

    await Promise.all(promises);

    console.log('\n--- RESULTS TO COPY INTO SCRAPER.TS ---');
    console.log(`Greenhouse: ['${validGreenhouse.join("', '")}']`);
    console.log(`Lever:      ['${validLever.join("', '")}']`);
    console.log(`Workable:   ['${validWorkable.join("', '")}']`);
}

run();
