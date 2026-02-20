import { chromium } from 'playwright';
import { resolve } from 'path';

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });

  try {
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(1000);

    // Get total number of sections
    const sectionCount = await page.evaluate(() => {
      return document.querySelectorAll('section').length;
    });

    console.log(`Found ${sectionCount} slides/sections\n`);

    // Capture each slide
    for (let i = 0; i < sectionCount; i++) {
      console.log(`\n=== SLIDE ${i + 1} ===`);
      
      // Scroll to the slide
      await page.evaluate((index) => {
        const sections = document.querySelectorAll('section');
        if (sections[index]) {
          sections[index].scrollIntoView({ behavior: 'smooth' });
        }
      }, i);

      await page.waitForTimeout(2000);

      // Take screenshot
      const filename = `slide-${i + 1}.png`;
      console.log(`Taking screenshot: ${filename}`);
      await page.screenshot({ 
        path: resolve(process.cwd(), 'screenshots', filename),
        fullPage: false
      });

      // Analyze slide
      const slideInfo = await page.evaluate((index) => {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = sections[index];
        
        if (!currentSection) return null;

        const heading = currentSection.querySelector('h1, h2, h3');
        const links = currentSection.querySelectorAll('a[class*="group"]');
        const buttons = currentSection.querySelectorAll('a[class*="button"], button, [href*="speaker"], [href*="keynote"], [href*="blog"], [href*="topic"], [href*="contact"]');
        
        const sectionStyles = window.getComputedStyle(currentSection);
        const backgroundColor = sectionStyles.backgroundColor;
        const backgroundImage = sectionStyles.backgroundImage;
        
        let headingInfo = null;
        if (heading) {
          const headingStyles = window.getComputedStyle(heading);
          headingInfo = {
            text: heading.textContent?.trim().substring(0, 100),
            fontSize: headingStyles.fontSize,
            fontFamily: headingStyles.fontFamily,
            color: headingStyles.color,
            fontWeight: headingStyles.fontWeight,
            webkitTextStroke: headingStyles.webkitTextStroke || 'none'
          };
        }

        const cardCount = links.length;
        const buttonCount = buttons.length;

        // Sample first card/link if exists
        let cardSample = null;
        if (links.length > 0) {
          const cardStyles = window.getComputedStyle(links[0]);
          cardSample = {
            border: cardStyles.border,
            borderWidth: cardStyles.borderWidth,
            backgroundColor: cardStyles.backgroundColor,
            borderRadius: cardStyles.borderRadius
          };
        }

        return {
          sectionIndex: index,
          id: currentSection.id || 'no-id',
          backgroundColor,
          backgroundImage: backgroundImage !== 'none' ? 'HAS_BACKGROUND_IMAGE' : 'none',
          heading: headingInfo,
          cardCount,
          buttonCount,
          cardSample
        };
      }, i);

      console.log(JSON.stringify(slideInfo, null, 2));
    }

    console.log('\n\n=== All screenshots saved to ./screenshots/ ===\n');

  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
