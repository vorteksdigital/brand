# Performance

Targets at p75 production: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, TTFB ≤800ms.
Budgets: compressed JS ≤300KB, CSS ≤100KB, above-fold images ≤500KB, total
initial page ≤1.5MB.

Safeguards: Server Components by default, Next Image with explicit dimensions
and responsive sizes, Sharp derivatives, local variable Geist font, bounded
Payload query depth/limits, 12-item pagination, publish revalidation, stable
media boxes, and no default third-party scripts. Draft mode bypasses public
caching. Run Lighthouse against production; hosting/CDN/database latency cannot
be represented reliably by local results.
