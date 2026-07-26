# SEO/AEO skill interpretation

- Source: `sanity-io/agent-toolkit`, skill `seo-aeo-best-practices`
- Installed/read: 2026-07-26
- Project rules: direct server-rendered answers; unique metadata; canonical URLs;
  published-only sitemaps; intentional robots policy; factual JSON-LD; clear
  headings; authorship, dates, citations, and contact signals.
- Patterns: Next Metadata API, Payload SEO fields, Open Graph, redirects,
  Breadcrumb/Article/Organisation/Website data, RSS, meaningful internal links.
- Tests: metadata/canonical, structured-data validity, published-only sitemap,
  robots exclusions, RSS XML, 404.
- Review: title/description length, one H1, clean slug, actual CMS-backed claims,
  image dimensions/alt, crawlable SSR text, freshness.
- Compatibility: examples target Sanity and older Next shapes; translated to
  Payload Local API and current async App Router APIs. AI-crawler policy remains
  a documented business choice.
- Applied: SEO plugin, metadata utilities, sitemap routes, robots route, RSS,
  redirects, editor checklist, author/date model.
