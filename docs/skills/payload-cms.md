# Payload CMS skill interpretation

- Source requested: `connorads/dotfiles`, skill `payload-cms`
- Attempted: 2026-07-26
- Result: command exited 1, `No matching skill found for: payload-cms`; repository
  advertised other skills only. No support directory was produced.
- Project rules used instead: official scaffold-installed Payload skill at
  `.agents/skills/payload/` and Payload 3.86 APIs. Keep packages on one exact
  Payload version; generate types/importmap after schema changes; use Local API
  server-side; enforce collection access; drafts need explicit access and
  preview auth; production PostgreSQL uses migrations.
- Patterns: typed `CollectionConfig`, Lexical, postgres adapter, Sharp, official
  Live Preview, hooks for revalidation, narrow relationship depth.
- Tests: type/importmap generation, Local API access, draft/public boundaries,
  migration, Admin/preview browser flows, build.
- Review: access override intent, hooks, generated types, migrations, upload
  policy, secrets, query limits/depth.
- Conflict resolution: unavailable third-party skill cannot override current
  APIs. Official Payload 3 scaffold and bundled skill are authoritative.
- Applied: official website scaffold, roles, Site Settings, Media validation,
  drafts/autosave, preview, scripts, docs.
