# ADR 002: PostgreSQL

Status: accepted, 2026-07-26.

Use official `@payloadcms/db-postgres` adapter. PostgreSQL supplies transactional
relational persistence and standard managed-host support. Development schema
push is convenient; production changes require reviewed Payload migrations.
