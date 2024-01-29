// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming

const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const totalBlockingTime = await page.evaluate(() => {
        return new Promise((resolve) => {
            let totalBlockingTime = 0;
            new PerformanceObserver(function (list) {
                const perfEntries = list.getEntries();
                for (const perfEntry of perfEntries) {
                    totalBlockingTime += perfEntry.duration - 50;
                }
                resolve(totalBlockingTime);
            }).observe({ type: 'longtask', buffered: true });

            // Resolve promise if there haven't been long tasks
            setTimeout(() => resolve(totalBlockingTime), 5000);
        });
    });

    console.log(parseFloat(totalBlockingTime)); // 0

    await browser.close();
})();
