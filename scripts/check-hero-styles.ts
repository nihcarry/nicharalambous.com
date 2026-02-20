import { chromium } from 'playwright';

async function checkHeroStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  // Execute the JavaScript
  const result = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return { error: 'h1 element not found' };
    
    const styles = window.getComputedStyle(h1);
    return JSON.stringify({
      letterSpacing: styles.letterSpacing,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      textTransform: styles.textTransform,
      webkitTextStroke: styles.webkitTextStroke,
      lineHeight: styles.lineHeight,
      paddingTop: styles.paddingTop,
      marginTop: styles.marginTop,
      offsetTop: h1.offsetTop,
      parentOffsetTop: h1.parentElement?.offsetTop,
      grandparentOffsetTop: h1.parentElement?.parentElement?.offsetTop,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      headerHeight: getComputedStyle(document.documentElement).getPropertyValue('--header-height-desktop'),
      navRect: JSON.stringify(document.querySelector('nav')?.getBoundingClientRect()),
      h1Rect: JSON.stringify(h1.getBoundingClientRect()),
    }, null, 2);
  });
  
  console.log('COMPUTED STYLES OUTPUT:');
  console.log(result);
  
  await browser.close();
}

checkHeroStyles().catch(console.error);
