# Project status

Recorded 2026-07-26. Repository began empty and outside Git. Official Payload
website scaffold initialized Git and installed Payload 3.86.0, Next 16.2.6,
React 19.2.6, TypeScript 5.7.3, Tailwind 4, PostgreSQL adapter, pnpm lockfile,
and baseline tests. Host: macOS; Node 25.7.0; npm 11.10.1; pnpm 10.33.2.

Implemented project hardening: roles, Media policy, Site Settings, skip link,
robots, RSS, visual-editor compatibility boundary/tests, Axe setup, scripts,
environment validation, and documentation. Verification state lives in
`verification-log.md`.

The homepage now uses a dedicated TypeScript brand hero with an interactive
fluid canvas and a scroll-pinned expanding film. The clip is served locally;
Payload-authored homepage blocks remain below it, and generic CMS heroes remain
available on other pages. The hero preserves the supplied VRTKS white,
uppercase, and difference-blend styling with proportional mobile scaling. Its
collapsed film pill remains in the measured text slot before the scroll
expansion and automatically remeasures that slot when the viewport or hero
geometry changes.

Password-reset delivery is wired to Resend through server-only environment
credentials and a verified sender address. Local development can still run
without email delivery while those variables are absent.

The custom production domain currently presents a noindex standalone coming-soon
page. The complete site remains available on its protected Vercel deployment
URL for private review, while Admin, APIs, preview endpoints, and static files
stay reachable on the custom domain.

The full-site review build now uses the supplied VRTKS header design: fixed
difference-blend branding, Cape Town time, Payload-configurable navigation with
reference defaults, persisted theme switching, and an accessible off-canvas
mobile menu. The temporary `delete-once-implemented` source path was removed
after the typed implementation and tests replaced it.
