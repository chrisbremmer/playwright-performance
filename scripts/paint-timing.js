// https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming

const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const paintTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType('paint'))
    );
    const paintTiming = JSON.parse(paintTimingJson);

    console.log(paintTiming);

    await browser.close();
})();
