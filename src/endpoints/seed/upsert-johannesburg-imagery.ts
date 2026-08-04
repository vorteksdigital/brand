import type { File, Payload, PayloadRequest } from 'payload'

import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

import {
  defaultSocialImageFileName,
  johannesburgMediaAssets,
} from '../../data/johannesburgMedia'
import type { Media } from '../../payload-types'

type UpsertOptions = {
  payload: Payload
  req?: PayloadRequest
}

const imageDirectory = path.resolve(process.cwd(), 'public/images/johannesburg')

async function getBundledImageFile(fileName: string): Promise<File> {
  const filePath = path.join(imageDirectory, fileName)
  const [data, file] = await Promise.all([readFile(filePath), stat(filePath)])

  return {
    data,
    mimetype: 'image/webp',
    name: fileName,
    size: file.size,
  }
}

export async function upsertJohannesburgMedia({
  payload,
  req,
}: UpsertOptions): Promise<Map<string, Media>> {
  const mediaByFileName = new Map<string, Media>()

  for (const asset of johannesburgMediaAssets) {
    const existing = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { filename: { equals: asset.fileName } },
    })

    const media = existing.docs[0]
      ? await payload.update({
          collection: 'media',
          id: existing.docs[0].id,
          data: { alt: asset.alt, credit: asset.credit, isDecorative: false },
          depth: 0,
          overrideAccess: true,
          req,
        })
      : await payload.create({
          collection: 'media',
          data: { alt: asset.alt, credit: asset.credit, isDecorative: false },
          depth: 0,
          file: await getBundledImageFile(asset.fileName),
          overrideAccess: true,
          req,
        })

    mediaByFileName.set(asset.fileName, media)
  }

  return mediaByFileName
}

export async function updateJohannesburgImageRelationships({
  payload,
  req,
}: UpsertOptions): Promise<{ posts: number; projects: number }> {
  const mediaByFileName = await upsertJohannesburgMedia({ payload, req })
  let posts = 0
  let projects = 0

  for (const asset of johannesburgMediaAssets) {
    const media = mediaByFileName.get(asset.fileName)
    if (!media) throw new Error(`Missing upserted Johannesburg media: ${asset.fileName}`)

    const postResult = await payload.find({
      collection: 'posts',
      depth: 0,
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { slug: { equals: asset.postSlug } },
    })
    const post = postResult.docs[0]

    if (post) {
      await payload.update({
        collection: 'posts',
        id: post.id,
        context: { disableRevalidate: true },
        data: {
          heroImage: media.id,
          meta: { ...post.meta, image: media.id },
        },
        depth: 0,
        draft: post._status === 'draft',
        overrideAccess: true,
        req,
      })
      posts += 1
    }

    if (!asset.projectSlug) continue

    const projectResult = await payload.find({
      collection: 'projects',
      depth: 0,
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { slug: { equals: asset.projectSlug } },
    })
    const project = projectResult.docs[0]

    if (project) {
      await payload.update({
        collection: 'projects',
        id: project.id,
        context: { disableRevalidate: true },
        data: { featuredImage: media.id },
        depth: 0,
        draft: project._status === 'draft',
        overrideAccess: true,
        req,
      })
      projects += 1
    }
  }

  const defaultSocialImage = mediaByFileName.get(defaultSocialImageFileName)
  if (!defaultSocialImage) throw new Error('Missing default Johannesburg social image.')

  await payload.updateGlobal({
    slug: 'site-settings',
    context: { disableRevalidate: true },
    data: { defaultSocialImage: defaultSocialImage.id },
    depth: 0,
    overrideAccess: true,
    req,
  })

  return { posts, projects }
}
