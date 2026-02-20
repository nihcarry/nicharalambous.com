import { chromium } from 'playwright';

async function checkUpdatedStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('http://localhost:3001');
  
  // Wait 3 seconds for hot-reload
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ 
    path: 'screenshots/hero-updated.png',
    fullPage: false
  });
  
  // Execute the JavaScript to check styles
  const result = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return { error: 'h1 element not found' };
    
    const styles = window.getComputedStyle(h1);
    return JSON.stringify({
      letterSpacing: styles.letterSpacing,
      fontSize: styles.fontSize,
      h1Rect: JSON.stringify(h1.getBoundingClientRect()),
    });
  });
  
  console.log('UPDATED COMPUTED STYLES:');
  console.log(result);
  
  await browser.close();
}

checkUpdatedStyles().catch(console.error);
