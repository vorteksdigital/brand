# Development

Follow root README setup. Payload type changes require
`pnpm payload:generate-types` and `pnpm payload:generate-importmap`. Development
PostgreSQL may push schema changes. Create migrations before production:
`pnpm payload:migrate:create`. Do not point development push mode at production.

Use `pnpm dev`; site is `/`, Admin is `/admin`, REST API is `/api`.
