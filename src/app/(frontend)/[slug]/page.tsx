import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { HomeHero } from '@/heros/HomeHero'
import { HomeSections } from '@/components/HomeSections'
import { generateMeta } from '@/utilities/generateMeta'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { staticPages, staticPageSlugs } from './staticPages'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const slugs = new Set(staticPageSlugs)

  pages.docs?.forEach(({ slug }) => {
    if (slug && slug !== 'home') slugs.add(slug)
  })

  return Array.from(slugs, (slug) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    page = staticPages[decodedSlug] || null
  }

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const isHomepage = decodedSlug === 'home'
  let renderedBlocks: React.ReactNode = null
  let renderedHero: React.ReactNode = <HomeHero />

  if (!isHomepage) {
    const { RenderHero } = await import('@/heros/RenderHero')
    renderedHero = <RenderHero {...hero} />
  }

  if (layout.length > 0) {
    const { RenderBlocks } = await import('@/blocks/RenderBlocks')
    renderedBlocks = <RenderBlocks blocks={layout} />
  }

  return (
    <article
      className={isHomepage ? undefined : 'route-shell'}
      data-route-shell={isHomepage ? undefined : ''}
    >
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {renderedHero}
      {isHomepage && <HomeSections />}
      {renderedBlocks}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page =
    (await queryPageBySlug({
      slug: decodedSlug,
    })) || staticPages[decodedSlug] || null

  return generateMeta({ doc: page })
}
