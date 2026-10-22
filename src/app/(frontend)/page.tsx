import type { Metadata } from 'next'

import { HomeSections } from '@/components/HomeSections'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { HomeHero } from '@/heros/HomeHero'
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

export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: '/' },
    description:
      'Johannesburg web design and development studio creating high-performing websites, WordPress platforms and digital products for growing businesses.',
    title: 'Web Design & Development Johannesburg | Vorteks Digital',
  }
}
