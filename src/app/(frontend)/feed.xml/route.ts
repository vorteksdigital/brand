import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

const escapeXML = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })
  const baseURL = getServerSideURL()
  const items = docs
    .map((post) => {
      const url = `${baseURL}/posts/${post.slug}`
      const description = post.meta?.description ?? post.title
      return `<item><title>${escapeXML(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXML(description)}</description>${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}</item>`
    })
    .join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Vorteks Digital</title><link>${baseURL}</link><description>Approved digital insights from Vorteks Digital</description>${items}</channel></rss>`,
    {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    },
  )
}
