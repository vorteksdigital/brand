import type { Payload } from 'payload'

import { createProjectData, projectSeeds } from './project-data'
import { upsertJohannesburgMedia } from './upsert-johannesburg-imagery'

export async function ensureBundledProjectMedia(payload: Payload): Promise<void> {
  await upsertJohannesburgMedia({ payload })
}

export async function upsertProjects(payload: Payload): Promise<number> {
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
