import type { MigrateUpArgs } from '@payloadcms/db-postgres'

if (process.env.VERCEL) {
  const [
    { default: config },
    { sql },
    { createLocalReq, getPayload },
    migration,
    { ensureBundledProjectMedia, upsertProjects },
  ] =
    await Promise.all([
      import('@payload-config'),
      import('@payloadcms/db-postgres'),
      import('payload'),
      import('../src/migrations/20260731_164532_projects_collection'),
      import('../src/endpoints/seed/upsert-projects'),
    ])
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  const state = await payload.db.drizzle.execute(sql`
    select
      to_regclass('public.projects') is not null as projects,
      to_regclass('public.projects_services') is not null as projects_services,
      to_regclass('public._projects_v') is not null as project_versions,
      to_regclass('public._projects_v_version_services') is not null as project_version_services,
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'payload_locked_documents_rels'
          and column_name = 'projects_id'
      ) as locked_relation
  `)
  const row = state.rows[0] as Record<string, boolean>
  const schemaParts = Object.values(row)
  const schemaReady = schemaParts.every(Boolean)
  const schemaAbsent = schemaParts.every((value) => !value)

  if (!schemaReady && !schemaAbsent) {
    await payload.destroy()
    throw new Error('Projects production schema is partially applied; refusing automatic repair.')
  }

  if (schemaAbsent) {
    await payload.db.drizzle.transaction(async (db) => {
      await migration.up({ db, payload, req } satisfies MigrateUpArgs)
      await db.execute(sql`
        insert into payload_migrations (name, batch, updated_at, created_at)
        select
          '20260731_164532_projects_collection',
          coalesce((select max(batch) from payload_migrations where batch > 0), 0) + 1,
          now(),
          now()
        where not exists (
          select 1 from payload_migrations
          where name = '20260731_164532_projects_collection'
        )
      `)
    })
    payload.logger.info('Applied Projects production migration.')
  }

  await ensureBundledProjectMedia(payload)
  const count = await upsertProjects(payload)
  payload.logger.info(`Upserted ${count} production projects with Johannesburg imagery.`)
  await payload.destroy()
}
