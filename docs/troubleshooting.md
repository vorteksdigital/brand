# Troubleshooting

- Database error: confirm PostgreSQL runs and `DATABASE_URL` database exists.
- Missing-variable error: compare `.env` with `.env.example`; restart server.
- Stale types/Admin import: run both Payload generate scripts and restart.
- Stale public page: publish again to trigger revalidation.
- Stale preview: confirm authenticated Admin session, exact
  `NEXT_PUBLIC_SERVER_URL`, preview secret, cookies, and same origin.
- Reset email logged instead of delivered: set both `RESEND_API_KEY` and a
  verified `RESEND_FROM_ADDRESS`, then restart the server.
- Playwright browser missing: `pnpm exec playwright install chromium`.
- Build differs locally: use supported Node LTS, clean `.next`, rerun build.
