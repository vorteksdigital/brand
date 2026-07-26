import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const baseURL = getServerSideURL()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/next/preview', '/next/exit-preview'],
    },
    sitemap: [`${baseURL}/pages-sitemap.xml`, `${baseURL}/posts-sitemap.xml`],
    host: baseURL,
  }
}
