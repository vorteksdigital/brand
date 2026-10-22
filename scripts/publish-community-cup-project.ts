import config from '@payload-config'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { getPayload, type File, type RequiredDataFromCollectionSlug } from 'payload'

const fileName = 'ebrahim-patel-community-cup.webp'
const slug = 'ebrahim-patel-community-cup'
const title = 'Ebrahim Patel Community Cup'

async function getImageFile(): Promise<File> {
  const filePath = path.resolve(process.cwd(), 'public/images/projects', fileName)
  const [data, fileStats] = await Promise.all([readFile(filePath), stat(filePath)])

  return {
    data,
    mimetype: 'image/webp',
    name: fileName,
    size: fileStats.size,
  }
}

const payload = await getPayload({ config })

try {
  const existingMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { filename: { equals: fileName } },
  })

  const mediaData = {
    alt: 'Portrait of Ebrahim Patel framed by green and gold rugby imagery',
    credit: 'Vorteks Digital',
    isDecorative: false,
  }
  const media = existingMedia.docs[0]
    ? await payload.update({
        collection: 'media',
        id: existingMedia.docs[0].id,
        data: mediaData,
        depth: 0,
        file: await getImageFile(),
        overrideAccess: true,
        overwriteExistingFiles: true,
      })
    : await payload.create({
        collection: 'media',
        data: mediaData,
        depth: 0,
        file: await getImageFile(),
        overrideAccess: true,
        overwriteExistingFiles: true,
      })

  const [existingProjects, lastProject] = await Promise.all([
    payload.find({
      collection: 'projects',
      depth: 0,
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: slug } },
    }),
    payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      sort: '-sortOrder',
    }),
  ])
  const existingProject = existingProjects.docs[0]
  const lastSortOrder = lastProject.docs[0]?.sortOrder ?? -1
  const data: RequiredDataFromCollectionSlug<'projects'> = {
    _status: 'published' as const,
    client: title,
    featuredImage: media.id,
    publishedAt: existingProject?.publishedAt ?? new Date().toISOString(),
    services: [],
    slug,
    sortOrder: existingProject?.sortOrder ?? lastSortOrder + 1,
    summary:
      'A green-and-gold rugby campaign celebrating community, sporting legacy and South African pride.',
    title,
    year: 2026,
  }

  const project = existingProject
    ? await payload.update({
        collection: 'projects',
        id: existingProject.id,
        context: { disableRevalidate: true },
        data,
        depth: 0,
        draft: false,
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data,
        depth: 0,
        draft: false,
        overrideAccess: true,
      })

  payload.logger.info(`Published project ${project.id}: ${title}`)
} finally {
  await payload.destroy()
}
