import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { getMediaUrl } from './getMediaUrl'
import { defaultMetaDescription, mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = serverUrl + getMediaUrl(ogUrl || image.url)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Vorteks Digital'
    : doc && 'title' in doc && doc.title
      ? `${doc.title} | Vorteks Digital`
      : 'Vorteks Digital'
  const slug = typeof doc?.slug === 'string' ? doc.slug : ''
  const isPost = Boolean(doc && 'content' in doc)
  const pathname = slug === 'home' ? '/' : isPost ? `/posts/${slug}` : `/${slug}`
  const canonical = new URL(pathname, getServerSideURL()).toString()
  const description = doc?.meta?.description || defaultMetaDescription

  return {
    description,
    alternates: {
      canonical,
    },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: canonical,
    }),
    title,
  }
}
