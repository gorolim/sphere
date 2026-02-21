const companies = [
    'huggingface', 'snorkel', 'labelbox', 'wandb', 'invisibletechnologies', 'invisible',
    'appen', 'telus', 'rws', 'centific', 'turing', 'alignerr', 'outlier', 'mindrift',
    'databricks', 'glean', 'nexus', 'baseten', 'replicate', 'pinecone', 'together',
    'modal', 'runway', 'midjourney', 'stabilityai', 'inflection', 'characterai', 'adept',
    'anthropic', 'openai', 'scaleai', 'surgeai', 'welocalize', 'cohere', 'ai21',
    'coreweave', 'lambda', 'blandai', 'synthesis', 'descript', 'synthesia', 'elevenlabs',
    'gretel', 'snips', 'xai', 'mistral', 'perry', 'copyai', 'jasper', 'mutiny', 'n8n', 'hotjar', 'langchain', 'llamaindex'
];

async function probeAshby(company: string) {
    try {
        const res = await fetch('https://api.ashbyhq.com/posting-api/job-board/' + company, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: "{ jobPostings { id title locationName employmentType url } }" })
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.jobPostings && data.data.jobPostings.length > 0) {
                console.log(`[ASHBY]      ✅ ${company} (${data.data.jobPostings.length} jobs)`);
                return company;
            }
        }
    } catch (e) {}
    return null;
}

async function probeBreezyHR(company: string) {
    try {
        const res = await fetch(`https://${company}.breezy.hr/json`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                console.log(`[BREEZYHR]   ✅ ${company} (${data.length} jobs)`);
                return company;
            }
        }
    } catch (e) {}
    return null;
}

async function probeRecruitee(company: string) {
    try {
        const res = await fetch(`https://${company}.recruitee.com/api/offers`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.offers && data.offers.length > 0) {
               console.log(`[RECRUITEE]  ✅ ${company} (${data.offers.length} jobs)`);
               return company;
            }
        }
    } catch (e) {}
    return null;
}

async function run() {
    console.log(`Probing ${companies.length} potential AI companies across 3 NEW ATS APIs (Ashby, BreezyHR, Recruitee)...`);
    const validAshby = [];
    const validBreezy = [];
    const validRecruitee = [];

    const promises = companies.map(async (c) => {
        const a = await probeAshby(c);
        if (a) validAshby.push(a);
        
        const b = await probeBreezyHR(c);
        if (b) validBreezy.push(b);

        const r = await probeRecruitee(c);
        if (r) validRecruitee.push(r);
    });

    await Promise.all(promises);

    console.log('\n--- RESULTS TO COPY INTO SCRAPER.TS ---');
    console.log(`Ashby:      ['${validAshby.join("', '")}']`);
    console.log(`BreezyHR:   ['${validBreezy.join("', '")}']`);
    console.log(`Recruitee:  ['${validRecruitee.join("', '")}']`);
}

run();
