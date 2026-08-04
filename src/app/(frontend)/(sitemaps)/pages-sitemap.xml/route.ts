import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { staticPageSlugs } from '@/app/(frontend)/[slug]/staticPages'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/blogs`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/image-credits`,
        lastmod: dateFallback,
      },
    ]

    const sitemapByLocation = new Map(defaultSitemap.map((entry) => [entry.loc, entry]))

    staticPageSlugs.forEach((slug) => {
      const loc = `${SITE_URL}/${slug}`
      sitemapByLocation.set(loc, { loc, lastmod: dateFallback })
    })

    results.docs?.forEach((page) => {
      if (!page.slug) return

      const loc = page.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`
      sitemapByLocation.set(loc, {
        loc,
        lastmod: page.updatedAt || dateFallback,
      })
    })

    return Array.from(sitemapByLocation.values())
  },
  ['pages-sitemap-v2'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
