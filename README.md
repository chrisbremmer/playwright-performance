# Web Performance APIs

With Google pushing for a faster web, [the Web Vitals metrics](https://web.dev/vitals/) should be on your rader. Google recommends focusing on the three most important ones - Largest Contentful Paint (LCP), First Input Delay (FID) and Cumulative Layout Shift (CLS). **These three metrics are considered the Core Web Vitals** and give a good idea of a page's loading behavior, interactivity, and visual stability.

Modern browsers support many APIs to gather web performance metrics and web vitals. This repo provides examples of how to measure performance and gather metrics such as the Web Vitals with headless tools such as Playwright.

## Web Performance APIs

### Navigation Timing API

The Navigation Timing and the Resource Timing performance APIs are W3C specifications. The [MDN docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings) defines the scope of both:

> Navigation timings are metrics measuring a browser’s document navigation events. Resource timings are detailed network timing measurements regarding the loading of an application’s resources. Both provide the same read-only properties, but navigation timing measures the main document’s timings whereas the resource timing provides the times for all the assets or resources called in by that main document and the resources' requested resources.

[The Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Navigation_timing) allows us to retrive timestamps of key events in the page load timeline. A Navigation Timing entry includes metrics such as the navigation response time, the used protocol and document load time.

[Code example](./scripts/navigation-timing.js)

### Resource Timing API

[The Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing) allows us to zoom in on single resources and get accurate information about how quickly they loaded. For example, we could specifically look at our website's logo:

[Code example](./scripts/resource-timing.js)
