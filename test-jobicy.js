async function run() {
    const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=50");
    const data = await res.json();
    const jobs = data.jobs || [];
    
    console.log(`Jobicy Total: ${jobs.length}`);
    for(let i=0; i<3; i++) {
        console.log(`Sample Job ${i+1}: ${jobs[i].jobTitle} at ${jobs[i].companyName}`);
    }
}
run();
