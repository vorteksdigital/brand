import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'

import { HeroImageReveal } from '@/components/ReferencePages/HeroImageReveal.client'
import { LowImpactHero } from '@/heros/LowImpact'

import { BlogFeed } from './BlogFeed'
import styles from './blog.module.scss'
import type { BlogCategoryData, BlogPostData } from './types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function BlogsPage() {
  const payload = await getPayload({ config: configPromise })
  const [postsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        categories: true,
        excerpt: true,
        heroImage: true,
        slug: true,
        title: true,
      },
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        title: true,
      },
      sort: 'title',
    }),
  ])

  const posts: BlogPostData[] = postsResult.docs.map((post) => ({
    categories:
      post.categories?.flatMap((category) =>
        category && typeof category === 'object'
          ? [{ id: category.id, slug: category.slug, title: category.title }]
          : [],
      ) || [],
    excerpt: post.excerpt,
    heroImage: post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null,
    id: post.id,
    slug: post.slug,
    title: post.title,
  }))
  const categories: BlogCategoryData[] = categoriesResult.docs.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: category.title,
  }))

  return (
    <div className="route-shell" data-route-shell>
      <HeroImageReveal />
      <LowImpactHero>
        <div
          className={`${styles['blog-hero-title-wrap']} payload-richtext mx-auto prose md:prose-md dark:prose-invert max-w-none`}
          data-hero-title-wrap
        >
          <div
            aria-hidden="true"
            className={styles['blog-hero-media']}
            data-hero-image-reveal
          >
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 48rem) 44vw, 18vw"
              src="/images/johannesburg/johannesburg-sunset-skyline.webp"
            />
          </div>
          <h1 className={`${styles['blog-hero-title']} mb-[0.25em]`} id="blogs-title">
            <span data-hero-image-shift>Insights</span>
          </h1>
        </div>
      </LowImpactHero>

      <BlogFeed categories={categories} initialPosts={posts} />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: '/blogs',
    },
    description:
      'Practical thinking on websites, digital products, WordPress, SEO and digital growth from Vorteks Digital.',
    title: 'Digital Insights for Startups | Vorteks Digital',
  }
}
