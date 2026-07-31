# Architecture

Single Next.js 16 application hosts React Server Component frontend, Payload 3
Admin/API, and PostgreSQL adapter. Payload Local API powers server-rendered
routes. Client components exist only for preview listeners, navigation, forms,
theme, and other interaction. Lexical stores rich text; Sharp creates responsive
media sizes. On-demand revalidation follows publish changes.

Public routes live in `src/app/(frontend)`, Admin/API in `src/app/(payload)`,
schemas in `src/collections`, blocks in `src/blocks`, and globals in
`src/Header`, `src/Footer`, and `src/SiteSettings`.

The temporary launch gate in `src/proxy.ts` rewrites public page requests from
`vorteksdigital.co.za` and `www.vorteksdigital.co.za` to the standalone
`src/app/(coming-soon)` experience. Vercel deployment hostnames and localhost
continue to render the full CMS site for review; production deployment
hostnames require the project's Vercel protection access. Admin, API, preview
infrastructure, Next.js internals, and public files bypass the gate. Remove the
proxy and standalone route group when the full site launches.

The fixed public header remains backed by Payload's `header` global and uses the
supplied projects/about/contact links only while that global is empty. Its client
boundary owns the Cape Town clock, persisted light/dark switch, active-route
state, and responsive off-canvas menu. The closed header uses difference blending
for contrast over changing page media. The mobile dialog locks document scroll,
traps keyboard focus, closes with Escape or a desktop breakpoint change, and
returns focus to its trigger.

The Payload Admin bar stays mounted while it checks the session but its wrapper
uses the native `hidden` state until authentication succeeds, so logged-out
requests reserve no layout space. When authenticated, the bar participates in
normal document flow and a `ResizeObserver` publishes its measured height as a
root CSS property. The fixed public header consumes that property as its top
offset, keeping the Admin bar, header, and page content in separate vertical
bands.

The root page keeps its Payload-authored block layout but replaces the generic
CMS hero renderer with `src/heros/HomeHero`. That client component owns the
homepage-only GSAP scroll sequence and Three.js fluid canvas; other pages
continue to render their selected Payload hero. The component scopes DOM access
to refs, suspends rendering while offscreen, honors reduced motion, and disposes
animation, observer, WebGL, and event resources on unmount. Its co-located CSS
module defines the white uppercase composition, open lower edge, 16:9 film slot,
and explicit copy/canvas/film layer order. The pill-to-film timeline starts from
the measured text slot, pins for 160% of the hero height, then returns the
Payload-authored page blocks to normal flow. Function-based start and end values
are invalidated on every ScrollTrigger refresh, so viewport, orientation, font,
and observed hero-size changes remeasure the pill without remounting.

Payload authentication email uses the official Resend adapter when
`RESEND_API_KEY` and `RESEND_FROM_ADDRESS` are both configured. With neither
variable present, development retains Payload's log-only email fallback; a
partial Resend configuration is rejected during runtime initialization.
