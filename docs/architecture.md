# Architecture

Single Next.js 16 application hosts React Server Component frontend, Payload 3
Admin/API, and PostgreSQL adapter. Payload Local API powers server-rendered
routes. Client components exist only for preview listeners, navigation, forms,
theme, and other interaction. Lexical stores rich text; Sharp creates responsive
media sizes. On-demand revalidation follows publish changes.

Public routes live in `src/app/(frontend)`, Admin/API in `src/app/(payload)`,
schemas in `src/collections`, blocks in `src/blocks`, and globals in
`src/Header`, `src/Footer`, and `src/SiteSettings`.

The root page keeps its Payload-authored block layout but replaces the generic
CMS hero renderer with `src/heros/HomeHero`. That client component owns the
homepage-only GSAP scroll sequence and Three.js fluid canvas; other pages
continue to render their selected Payload hero. The component scopes DOM access
to refs, suspends rendering while offscreen, honors reduced motion, and disposes
animation, observer, WebGL, and event resources on unmount. Its co-located CSS
module defines the white uppercase composition, striped lower divider, 16:9
film slot, and explicit copy/canvas/film layer order. The original pill-to-film
timeline pins for 160% of the measured hero height, then returns the
Payload-authored page blocks to normal flow.
