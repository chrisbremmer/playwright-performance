# Web Performance APIs

With Google pushing for a faster web, [the Web Vitals metrics](https://web.dev/vitals/) should be on your rader. Google recommends focusing on the three most important ones - Largest Contentful Paint (LCP), First Input Delay (FID) and Cumulative Layout Shift (CLS). **These three metrics are considered the Core Web Vitals** and give a good idea of a page's loading behavior, interactivity, and visual stability.

Modern browsers support many APIs to gather web performance metrics and web vitals. This repo provides examples of how to measure performance and gather metrics such as the Web Vitals with headless tools such as Playwright.

## Web Performance APIs

### Navigation Timing API

The Navigation Timing and the Resource Timing performance APIs are W3C specifications. The [MDN docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings) defines the scope of both:

> Navigation timings are metrics measuring a browser’s document navigation events. Resource timings are detailed network timing measurements regarding the loading of an application’s resources. Both provide the same read-only properties, but navigation timing measures the main document’s timings whereas the resource timing provides the times for all the assets or resources called in by that main document and the resources' requested resources.

[The Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Navigation_timing) allows us to retrive timestamps of key events in the page load timeline. A Navigation Timing entry includes metrics such as the navigation response time, the used protocol and document load time.

[Code example](./scripts/navigation-timing.js)

```bash
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const navigationTimingJson = await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByType('navigation'))
    );
    const navigationTiming = JSON.parse(navigationTimingJson);

    console.log(navigationTiming);

    await browser.close();
})();
```

Console output:

```bash
[{
  name: 'https://danube-web.shop/',
  entryType: 'navigation',
  startTime: 0,
  duration: 1243.7999999998137,
  initiatorType: 'navigation',
  nextHopProtocol: 'http/1.1',
  workerStart: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 0.10000000009313226,
  domainLookupStart: 1.2000000001862645,
  domainLookupEnd: 11.100000000093132,
  connectStart: 11.100000000093132,
  connectEnd: 336.8000000002794,
  secureConnectionStart: 102.89999999990687,
  requestStart: 336.89999999990687,
  responseStart: 432.39999999990687,
  responseEnd: 433.70000000018626,
  transferSize: 971,
  encodedBodySize: 671,
  decodedBodySize: 671,
  serverTiming: [],
  workerTiming: [],
  unloadEventStart: 0,
  unloadEventEnd: 0,
  domInteractive: 1128.8999999999069,
  domContentLoadedEventStart: 1128.8999999999069,
  domContentLoadedEventEnd: 1130.8999999999069,
  domComplete: 1235.3999999999069,
  loadEventStart: 1235.3999999999069,
  loadEventEnd: 1235.3999999999069,
  type: 'navigate',
  redirectCount: 0
}]
```

### Resource Timing API

[The Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing) allows us to zoom in on single resources and get accurate information about how quickly they loaded. For example, we could specifically look at our website's logo:

[Code example](./scripts/resource-timing.js)

```bash
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const resourceTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType('resource'))
    );

    const resourceTiming = JSON.parse(resourceTimingJson);
    const logoResourceTiming = resourceTiming.find((element) =>
        element.name.includes('.svg')
    );

    console.log(logoResourceTiming);

    await browser.close();
})();
```

Console output:

```bash
{
  name: 'https://danube-web.shop/static/logo-horizontal.svg',
  entryType: 'resource',
  startTime: 1149.1000000000931,
  duration: 96.89999999990687,
  initiatorType: 'img',
  nextHopProtocol: 'http/1.1',
  workerStart: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 1149.1000000000931,
  domainLookupStart: 1149.1000000000931,
  domainLookupEnd: 1149.1000000000931,
  connectStart: 1149.1000000000931,
  connectEnd: 1149.1000000000931,
  secureConnectionStart: 1149.1000000000931,
  requestStart: 1149.6000000000931,
  responseStart: 1244.3000000002794,
  responseEnd: 1246,
  transferSize: 21049,
  encodedBodySize: 20749,
  decodedBodySize: 20749,
  serverTiming: [],
  workerTiming: []
}
```

### Paint Timing API (`first-paint` and `first-contentful-paint`)

[The Paint Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming) provides information on the first paint and the first contentful paint. Access the entries via `performance.getEntriesByType('paint')` or `performance.getEntriesByName('first-contentful-paint')`

[Code example](./scripts/paint-timing.js)

```bash
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
```

Console output:

```bash
[
  { name: 'first-paint', entryType: 'paint', startTime: 1149.5, duration: 0 },
  { name: 'first-contentful-paint', entryType: 'paint', startTime: 1149.5, duration: 0 }
]
```

### Largest Contentful Paint API (`largest-contentful-paint`)

[The Largest Contentful Paint API](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint) provides information on all large paints. Use this API to evaluate the Core Web Vital [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp).

> Large contentful paints are not a single event but rather event streams. A large paint can always be followed by an even larger one.
>
> To evaluate the LCP initialize a `PerformanceObserver`, observe `largest-contentful-paint` entries and access the last emitted paint.

[Code example](./scripts/largest-contentful-paint.js)

```bash
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const largestContentfulPaint = await page.evaluate(() => {
        return new Promise((resolve) => {
            new PerformanceObserver((l) => {
                const entries = l.getEntries();
                // the last entry is the largest contentful paint
                const largestPaintEntry = entries.at(-1);
                resolve(largestPaintEntry.startTime);
            }).observe({
                type: 'largest-contentful-paint',
                buffered: true,
            });
        });
    });

    console.log(parseFloat(largestContentfulPaint)); // 1139.39

    await browser.close();
})();
```

Console output:

```bash
1046.7000000476837
```

### Layout Instability API (`layout-shift`)

[The Layout Instability API](https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift) provides information on all layout shifts. Use this API to evaluate the Core Web Vital [Cumulative Layout Shift](https://web.dev/articles/cls) (CLS).

> Layout shifts are no single event but event streams. To calculate CLS initialize a `PerformanceObserver`, observe `layout-shift` entries and sum all shifts.

[Code example](./scripts/layout-instability.js)

```bash
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://danube-web.shop/');

    const cummulativeLayoutShift = await page.evaluate(() => {
        return new Promise((resolve) => {
            let CLS = 0;

            new PerformanceObserver((l) => {
                const entries = l.getEntries();

                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        CLS += entry.value;
                    }
                });

                resolve(CLS);
            }).observe({
                type: 'layout-shift',
                buffered: true,
            });
        });
    });

    console.log(parseFloat(cummulativeLayoutShift)); // 0.0001672498

    await browser.close();
})();
```

Console output:

```bash
0.00009616597493489583
```

### Long Task API (`longtask`)

[The Long Task API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming) provides information about all JavaScript executions taking 50 milliseconds or more. Use this API to evaluate the Web Vital and lab metric [Total Blocking Time](https://web.dev/articles/tbt) (TBT)

> Long Tasks are no single event but event streams. To calclate TBT initialize a `PerformanceObserver`, observe `longtasks` entries and sum the differences to the maximal JavaScript execution time of 50 milliseconds.

[Code example](./scripts/long-task.js)

```bash
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
```

Console output:

```bash
0
```
