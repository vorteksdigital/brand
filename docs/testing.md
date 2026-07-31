# Testing

- `pnpm test:unit`: compatibility and pure utility tests.
- `pnpm test:integration`: Payload Local API; requires test PostgreSQL.
- `pnpm test:e2e`: Playwright browser flows; starts configured web server.
- `pnpm test:a11y`: Axe WCAG A/AA checks for `/` and `/posts`.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`: static and production checks.
- `pnpm verify`: generated artifacts, lint, types, unit/integration, build.

Set `DATABASE_URL` to an isolated disposable database for integration/browser
tests. Install browsers once with `pnpm exec playwright install chromium`.
Manual release checks remain: keyboard, 200%/400% zoom, screen reader, draft
preview Page/Post edits, viewport widths, publish/unpublish, and migration restore.

Frontend browser coverage includes the responsive header drawer, focus return,
scroll locking, theme switching, pointer/keyboard focus styling, and
mobile-to-desktop cleanup. Authenticated Admin coverage verifies that the Admin
bar offsets both the fixed header and the public page content.
