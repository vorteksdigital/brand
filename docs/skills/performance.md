# Performance skill interpretation

- Source: `addyosmani/web-quality-skills`, skill `performance` (MIT)
- Installed/read: 2026-07-26
- Project rules: prioritize measured Core Web Vitals; budgets of 1.5MB initial
  weight, 300KB compressed JS, 100KB CSS, 500KB above-fold images; preserve
  accessibility/SEO; keep third-party scripts controlled.
- Patterns: Server Components, route splitting, Next Image/Sharp derivatives,
  explicit dimensions/sizes, font swap, bounded queries/pagination, stable
  layouts, cache/revalidation outside drafts.
- Tests: production build, Lighthouse in production-like hosting, image
  dimension check, bundle/budget review, mobile throttling.
- Review: LCP priority, no hydration without interaction, query depth and N+1,
  cache privacy, font/image sizes, third-party cost.
- Compatibility: raw preload/service-worker/speculation examples are not added
  blindly; current Next asset pipeline and host/CDN control headers.
- Applied: official RSC template, local Geist, responsive media, bounded post
  queries, caching/revalidation guidance and targets.
