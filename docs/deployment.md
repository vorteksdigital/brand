# Deployment

Provision PostgreSQL, persistent object storage for multi-instance production
(local `public/media` is suitable only for one persistent host), HTTPS domain,
and environment variables. Build with `pnpm build`, apply reviewed migrations
with `pnpm payload:migrate`, then run `pnpm start`.

Back up database and media, pin Node/pnpm from `package.json`, health-check `/`
and `/admin`, and configure CDN compression/cache headers. Set canonical
`NEXT_PUBLIC_SERVER_URL`. Set `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, and
optionally `RESEND_FROM_NAME`; the sender address must belong to a domain
verified in Resend. Verify password-reset delivery, preview embedding, and CSP
on the final domain.

Vercel production uses the Supabase transaction pooler with TLS required. Keep
Sharp disabled in Vercel functions until a persistent object-storage adapter is
configured; local and non-Vercel deployments retain Sharp image processing.
Apply migrations separately before deployment. Do not rely on Vercel's
ephemeral filesystem for uploaded media. `.vercelignore` excludes local
environment files, generated test/build output, generated sitemap/robots files,
and local media from CLI deployment uploads.

The current launch gate is hostname-based: custom-domain public pages rewrite to
`/coming-soon`, while protected Vercel deployment URLs expose the complete site
for authenticated review. The stable Vercel production alias redirects to the
custom domain. Admin/API and supporting assets remain available on either
hostname. At launch, delete `src/proxy.ts`, `src/utilities/comingSoon.ts`,
`src/app/(coming-soon)`, and its unit test, then run the full release checks
before redeploying.
