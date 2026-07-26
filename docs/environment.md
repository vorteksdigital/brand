# Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Payload encryption/JWT secret |
| `NEXT_PUBLIC_SERVER_URL` | Canonical origin, no trailing slash |
| `PREVIEW_SECRET` | Server-only draft-preview token |
| `CRON_SECRET` | Bearer token for scheduled jobs |

`.env.example` contains local placeholders. `.env` is ignored. Never expose
server secrets through `NEXT_PUBLIC_*`. Production requires HTTPS and unique,
high-entropy secrets.
