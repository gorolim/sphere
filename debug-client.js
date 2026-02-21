const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  // Capture page errors (unhandled exceptions)
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  try {
    console.log('Navigating to Master Admin Engine Storm...');
    await page.goto('http://localhost:3000/master-admin/engine-storm', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Loaded successfully. Waiting to see if client exception occurs...');
    await new Promise(r => setTimeout(r, 5000));
  } catch (error) {
    console.log('Navigation or timeout error:', error.message);
  } finally {
    await browser.close();
  }
})();
