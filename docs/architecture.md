# Architecture

Single Next.js 16 application hosts React Server Component frontend, Payload 3
Admin/API, and PostgreSQL adapter. Payload Local API powers server-rendered
routes. Client components exist only for preview listeners, navigation, forms,
theme, and other interaction. Lexical stores rich text; Sharp creates responsive
media sizes. On-demand revalidation follows publish changes.

Public routes live in `src/app/(frontend)`, Admin/API in `src/app/(payload)`,
schemas in `src/collections`, blocks in `src/blocks`, and globals in
`src/Header`, `src/Footer`, and `src/SiteSettings`.
