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
