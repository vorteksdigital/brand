# Deployment

Provision PostgreSQL, persistent object storage for multi-instance production
(local `public/media` is suitable only for one persistent host), HTTPS domain,
and environment variables. Build with `pnpm build`, apply reviewed migrations
with `pnpm payload:migrate`, then run `pnpm start`.

Back up database and media, pin Node/pnpm from `package.json`, health-check `/`
and `/admin`, and configure CDN compression/cache headers. Set canonical
`NEXT_PUBLIC_SERVER_URL`. Verify preview embedding and CSP on final domain.

Vercel production uses the Supabase transaction pooler with TLS required. Keep
Sharp's Linux runtime packages in `optionalDependencies`; Vercel function
tracing includes Sharp and `@img` native assets for Payload image processing.
Apply migrations separately before deployment.
