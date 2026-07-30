# Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Payload encryption/JWT secret |
| `NEXT_PUBLIC_SERVER_URL` | Canonical origin, no trailing slash |
| `PREVIEW_SECRET` | Server-only draft-preview token |
| `CRON_SECRET` | Bearer token for scheduled jobs |
| `RESEND_API_KEY` | Server-only Resend credential; enables email with `RESEND_FROM_ADDRESS` |
| `RESEND_FROM_ADDRESS` | Sender address from a domain verified in Resend |
| `RESEND_FROM_NAME` | Optional sender display name; defaults to `VRTKS Digital` |

`.env.example` contains local placeholders. `.env` is ignored. Never expose
server secrets through `NEXT_PUBLIC_*`. Resend remains disabled when both its
key and sender address are absent; configuring only one is rejected. Production
requires HTTPS, unique high-entropy secrets, and both Resend variables.
