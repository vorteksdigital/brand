import type { Payload } from 'payload'

import type { Media } from '../../payload-types'
import { createProjectData, projectSeeds } from './project-data'
import { upsertJohannesburgMedia } from './upsert-johannesburg-imagery'

export async function ensureBundledProjectMedia(payload: Payload): Promise<Map<string, Media>> {
  return upsertJohannesburgMedia({ payload })
}

export async function upsertProjects(
  payload: Payload,
  mediaByFileName: Map<string, Media>,
): Promise<number> {
  for (const [sortOrder, project] of projectSeeds.entries()) {
    const featuredImage = mediaByFileName.get(project.imageFilename)

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
