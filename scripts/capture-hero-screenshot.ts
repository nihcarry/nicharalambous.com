import { chromium } from 'playwright';

async function captureScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'screenshots/hero-full-page.png', 
    fullPage: true 
  });
  
  // Take viewport screenshot (what user sees on load)
  await page.screenshot({ 
    path: 'screenshots/hero-viewport.png',
    fullPage: false
  });
  
  await browser.close();
  console.log('Screenshots captured successfully!');
}

captureScreenshot().catch(console.error);
