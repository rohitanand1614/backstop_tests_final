module.exports = async (page, scenario) => {
    const acceptButtonSelector = 'button.cmplz-accept'; // Replace this with the actual locator when known
  
    // If accept button is present, click it
    const acceptBtn = await page.$(acceptButtonSelector);
    if (acceptBtn) {
      await acceptBtn.click();
      await page.waitForTimeout(1000); // Wait after clicking if needed
    }
  
    // Slow scroll for lazy loading
    const scrollStep = 200;
    const scrollDelay = 500;
    let currentHeight = 0;
    let height = await page.evaluate(() => document.body.scrollHeight);
  
    while (currentHeight < height) {
      currentHeight += scrollStep;
      await page.evaluate(h => window.scrollTo(0, h), currentHeight);
      await page.waitForTimeout(scrollDelay);
      height = await page.evaluate(() => document.body.scrollHeight);
    }
  };
  