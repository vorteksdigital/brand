import type { Metadata } from 'next'

import { HomeSections } from '@/components/HomeSections'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import { HomeHero } from '@/heros/HomeHero'
import { generateMeta } from '@/utilities/generateMeta'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'
import { draftMode } from 'next/headers'

import PageClient from './[slug]/page.client'

export const revalidate = 600

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url="/" />
      {draft && <LivePreviewListener />}
      <HomeHero />
      <HomeSections />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = (await queryPageBySlug({ slug: 'home' })) || homeStatic

  return generateMeta({ doc: page })
}
