# VRTKS Digital

Production website foundation combining Next.js App Router and Payload CMS with
PostgreSQL, strict TypeScript, Tailwind CSS, Pages, Posts, Media, drafts, live
preview, SEO, accessibility, and automated tests.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- pnpm 9–11
- PostgreSQL 14+ or Docker

## Setup

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm dev
```

Replace all placeholder secrets in `.env`; generate values with
`openssl rand -hex 32`. Database schema is pushed automatically only in
development. Open `http://localhost:3000/admin` and complete the first-user form;
the first user should be assigned `admin`.

## Commands

```bash
pnpm dev                 # website and CMS
pnpm lint
pnpm typecheck
pnpm test                # unit and integration
pnpm test:e2e
pnpm test:a11y
pnpm build
pnpm payload:migrate:create
pnpm payload:migrate
pnpm verify
```

Production deployments run `pnpm build`, `pnpm payload:migrate`, then
`pnpm start`. See [documentation index](docs/README.md), especially
[development](docs/development.md), [deployment](docs/deployment.md), and
[testing](docs/testing.md).
