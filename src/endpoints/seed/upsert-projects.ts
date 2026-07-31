import type { Payload } from 'payload'

import { sql } from '@payloadcms/db-postgres'
import { stat } from 'node:fs/promises'
import path from 'node:path'

import { createProjectData, projectSeeds } from './project-data'

export async function ensureBundledProjectMedia(payload: Payload): Promise<void> {
  for (const project of projectSeeds) {
    const filePath = path.resolve(process.cwd(), 'public/media', project.imageFilename)
    const file = await stat(filePath)

    await payload.db.drizzle.execute(sql`
      insert into media (
        alt,
        is_decorative,
        updated_at,
        created_at,
        url,
        filename,
        mime_type,
        filesize,
        width,
        height,
        focal_x,
        focal_y
      )
      values (
        ${project.imageAlt},
        false,
        now(),
        now(),
        ${`/api/media/file/${project.imageFilename}`},
        ${project.imageFilename},
        'image/webp',
        ${file.size},
        1600,
        1000,
        50,
        50
      )
      on conflict (filename) do nothing
    `)
  }
}

export async function upsertMockProjects(payload: Payload): Promise<number> {
  for (const [sortOrder, project] of projectSeeds.entries()) {
    const mediaResult = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        filename: {
          equals: project.imageFilename,
        },
      },
    })
    const featuredImage = mediaResult.docs[0]

    if (!featuredImage) {
      throw new Error(`Missing project seed media: ${project.imageFilename}`)
    }

    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: project.slug,
        },
      },
    })
    const data = createProjectData(project, featuredImage.id, sortOrder)

    if (existing.docs[0]) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        context: { disableRevalidate: true },
        data,
      })
    } else {
      await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data,
      })
    }
  }

  return projectSeeds.length
}
