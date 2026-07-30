# Security

Environment validation rejects missing core secrets at runtime. Preview route
uses a server-only token, verifies collection/slug, enables HTTP-only Next draft
mode, and is disallowed from indexing. CORS uses configured site origin. Admin
requires authentication; roles restrict user management; public collection
queries expose published content only. Uploads accept images and use size limits
configured by infrastructure. Password-reset email uses Resend only when its
server-only API key and verified sender address are both configured; the key is
never exposed through a public environment variable. Local environment files
are also explicitly excluded from Vercel CLI uploads.

Production: HTTPS, secret rotation, database TLS/firewall/backups, rate limits
for auth/forms/public mutations, persistent malware-aware object storage,
security headers/CSP tuned to exact preview origin, dependency review, and
sanitised logs. Lexical is rendered by maintained Payload components; arbitrary
editor HTML is not enabled. Never auto-apply breaking audit upgrades.

Audit assessment 2026-07-26: production high/critical audit passes after safe
Next, Sharp, PostCSS, and Vitest updates. Full development audit retains one
high `brace-expansion` advisory through `eslint-config-next`/`minimatch`; forcing
the patched major breaks ESLint's plugin API. Exposure is lint-time glob
processing, not production runtime. Track upstream and do not lint untrusted
attacker-created path sets.
