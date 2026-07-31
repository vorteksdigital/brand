import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { LowImpactHero } from '@/heros/LowImpact'

import { BlogFeed } from './BlogFeed'
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
    <div className="pt-16 pb-24">
      <LowImpactHero>
        <div className="payload-richtext mx-auto prose md:prose-md dark:prose-invert max-w-none">
          <h1 className="mb-[0.25em]" id="blogs-title">
            Blogs
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
    title: 'Blogs | VRTKS Digital',
  }
}
