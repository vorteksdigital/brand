import config from '@payload-config'
import {
  convertMarkdownToLexical,
  type SanitizedServerEditorConfig,
} from '@payloadcms/richtext-lexical'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { getPayload, type File, type Payload } from 'payload'

import type { Media, Post } from '../src/payload-types'

const slug = 'your-website-now-has-two-audiences-humans-and-ai'
const legacySlug = 'web-design-for-humans-and-ai'
const title = 'Your Website Now Has Two Audiences: Humans and AI'
const excerpt =
  'People are increasingly discovering businesses through ChatGPT, Google AI Mode, Copilot and other AI-driven search experiences. That means modern websites need to work for two audiences: humans and machines. Here is what that changes for web design, development, SEO and content.'
const metaDescription =
  'AI search is changing how websites are discovered. Learn what businesses need to change across web design, development, SEO and content in 2026.'

const assets = [
  {
    alt: 'Abstract red and black digital glitch art formed from fragmented data marks',
    blockName: 'AI search hero',
    credit: 'Egor Komarov / Unsplash',
    fileName: 'ai-search-glitch.webp',
  },
  {
    alt: 'Abstract orange and black digital fragments arranged as a shifting system',
    blockName: 'Connected content fragments',
    credit: 'Logan Voss / Unsplash',
    fileName: 'ai-search-fragments.webp',
  },
  {
    alt: 'Red geometric lines forming a connected network against black',
    blockName: 'Machine-readable network',
    credit: 'Gábor Szűts / Unsplash',
    fileName: 'ai-search-network.webp',
  },
  {
    alt: 'Red and black spheres linked across an abstract digital system',
    blockName: 'Connected search signals',
    credit: 'Zoha Gohar / Unsplash',
    fileName: 'ai-search-spheres.webp',
  },
] as const

type MutableLexicalContent = {
  root: {
    children: unknown[]
  }
}

function getEditorConfig(editor: unknown): SanitizedServerEditorConfig {
  if (
    !editor ||
    typeof editor !== 'object' ||
    !('editorConfig' in editor) ||
    !editor.editorConfig ||
    typeof editor.editorConfig !== 'object'
  ) {
    throw new Error('Payload did not expose a sanitized Lexical editor configuration.')
  }

  return editor.editorConfig as SanitizedServerEditorConfig
}

function getPostContentEditorConfig(value: unknown): SanitizedServerEditorConfig | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const editorConfig = getPostContentEditorConfig(item)
      if (editorConfig) return editorConfig
    }
    return null
  }

  if (!value || typeof value !== 'object') return null

  if (
    'name' in value &&
    value.name === 'content' &&
    'type' in value &&
    value.type === 'richText' &&
    'editor' in value
  ) {
    return getEditorConfig(value.editor)
  }

  if ('fields' in value) {
    const editorConfig = getPostContentEditorConfig(value.fields)
    if (editorConfig) return editorConfig
  }

  if ('tabs' in value) return getPostContentEditorConfig(value.tabs)

  return null
}

async function getFile(fileName: string): Promise<File> {
  const filePath = path.resolve(process.cwd(), 'public/images/cosmos', fileName)
  const [data, fileStats] = await Promise.all([readFile(filePath), stat(filePath)])

  return {
    data,
    mimetype: 'image/webp',
    name: fileName,
    size: fileStats.size,
  }
}

async function upsertMedia(payload: Payload, asset: (typeof assets)[number]): Promise<Media> {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { filename: { equals: asset.fileName } },
  })

  if (existing.docs[0]) {
    return payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: { alt: asset.alt, credit: asset.credit, isDecorative: false },
      depth: 0,
      file: await getFile(asset.fileName),
      overrideAccess: true,
      overwriteExistingFiles: true,
    })
  }

  return payload.create({
    collection: 'media',
    data: { alt: asset.alt, credit: asset.credit, isDecorative: false },
    depth: 0,
    file: await getFile(asset.fileName),
    overrideAccess: true,
    overwriteExistingFiles: true,
  })
}

const payload = await getPayload({ config })

try {
  const [heroImage, ...inlineImages] = await Promise.all(
    assets.map((asset) => upsertMedia(payload, asset)),
  )

  const [users, categoryResults, existingPosts, relatedPosts] = await Promise.all([
    payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      sort: 'createdAt',
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: 'ai-search' } },
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      draft: true,
      limit: 2,
      overrideAccess: true,
      pagination: false,
      where: {
        or: [{ slug: { equals: slug } }, { slug: { equals: legacySlug } }],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 3,
      overrideAccess: true,
      pagination: false,
      sort: '-publishedAt',
      where: {
        and: [{ slug: { not_equals: slug } }, { slug: { not_equals: legacySlug } }],
      },
    }),
  ])

  if (existingPosts.docs.length > 1) {
    throw new Error(
      `Both ${slug} and ${legacySlug} exist. Resolve the duplicate before publishing.`,
    )
  }

  const existingPost = existingPosts.docs[0]

  const author = users.docs[0]
  if (!author) throw new Error('At least one Payload user is required to publish the post.')

  const category =
    categoryResults.docs[0] ??
    (await payload.create({
      collection: 'categories',
      data: {
        description: 'AI discovery, answer engines, modern SEO, and web visibility.',
        slug: 'ai-search',
        title: 'AI & Search',
      },
      depth: 0,
      overrideAccess: true,
    }))

  const source = await readFile(
    path.resolve(process.cwd(), 'content/posts/web-design-for-humans-and-ai.md'),
    'utf8',
  )
  const markdown = source.replace(/^# Your Website Now Has Two Audiences: Humans and AI\s+/, '')
  const postEditorConfig = getPostContentEditorConfig(payload.collections.posts.config.fields)
  if (!postEditorConfig)
    throw new Error('Could not resolve the Posts content editor configuration.')
  const content = convertMarkdownToLexical({
    editorConfig: postEditorConfig,
    markdown,
  }) as MutableLexicalContent

  const insertionFractions = [0.25, 0.5, 0.75]
  const inlineMediaNodes = inlineImages.map((image, index) => ({
    index: Math.max(1, Math.floor(content.root.children.length * insertionFractions[index])),
    node: {
      fields: {
        blockName: assets[index + 1].blockName,
        blockType: 'mediaBlock',
        media: image.id,
      },
      format: '',
      type: 'block',
      version: 2,
    },
  }))

  for (const insertion of inlineMediaNodes.reverse()) {
    content.root.children.splice(insertion.index, 0, insertion.node)
  }

  const data = {
    _status: 'published' as const,
    authors: [author.id],
    categories: [category.id],
    content: content as unknown as Post['content'],
    excerpt,
    heroImage: heroImage.id,
    meta: {
      description: metaDescription,
      image: heroImage.id,
      title,
    },
    publishedAt: existingPost?.publishedAt ?? new Date().toISOString(),
    relatedPosts: relatedPosts.docs.map((post) => post.id),
    slug,
    title,
  }

  const post = existingPost
    ? await payload.update({
        collection: 'posts',
        id: existingPost.id,
        context: { disableRevalidate: true },
        data,
        depth: 0,
        draft: false,
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'posts',
        context: { disableRevalidate: true },
        data,
        depth: 0,
        draft: false,
        overrideAccess: true,
      })

  payload.logger.info(`Published post ${post.id}: /posts/${slug}`)
} finally {
  await payload.destroy()
}
