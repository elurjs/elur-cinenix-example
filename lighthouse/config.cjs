// Lighthouse performance budgets for cinenix-example (audit §12.7 / §6).
// Run against a running server:
//   npx lighthouse http://127.0.0.1:3000 --config-path=lighthouse/config.cjs
module.exports = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "desktop",
    screenEmulation: { mobile: false, width: 1280, height: 800, deviceScaleFactor: 1 },
    throttlingMethod: "simulate",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    budgets: {
      resourceSizes: [
        { resourceType: "script", budget: 120 },
        { resourceType: "document", budget: 40 },
      ],
      timings: [
        { metric: "first-contentful-paint", budget: 2500 },
        { metric: "largest-contentful-paint", budget: 3000 },
        { metric: "total-blocking-time", budget: 200 },
        { metric: "cumulative-layout-shift", budget: 0.1 },
      ],
    },
  },
};
