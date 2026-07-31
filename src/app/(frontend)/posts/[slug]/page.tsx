import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { JsonLd } from '@/components/JsonLd'
import { getServerSideURL } from '@/utilities/getURL'
import { Facebook, Linkedin, Twitter } from 'lucide-react'

import styles from './post.module.css'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const canonical = new URL(url, getServerSideURL()).toString()
  const authors = post.populatedAuthors?.map((author) => author.name).filter(Boolean) ?? []

  return (
    <article className={styles.post}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              mainEntityOfPage: canonical,
              author: authors.map((name) => ({ '@type': 'Person', name })),
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: getServerSideURL() },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Posts',
                  item: new URL('/posts', getServerSideURL()).toString(),
                },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
              ],
            },
          ],
        }}
      />
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className={styles.articleGrid} id="article-content">
        <aside aria-label="Share this article" className={styles.shareRail}>
          <ul className={styles.shareList}>
            <li>
              <a
                aria-label="Share on LinkedIn"
                className={styles.shareLink}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin aria-hidden="true" size={13} strokeWidth={1.8} />
              </a>
            </li>
            <li>
              <a
                aria-label="Share on X"
                className={styles.shareLink}
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(post.title)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Twitter aria-hidden="true" size={13} strokeWidth={1.8} />
              </a>
            </li>
            <li>
              <a
                aria-label="Share on Facebook"
                className={styles.shareLink}
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Facebook aria-hidden="true" size={13} strokeWidth={1.8} />
              </a>
            </li>
          </ul>
        </aside>

        <div className={styles.contentColumn}>
          <RichText
            className={styles.richText}
            data={post.content}
            enableGutter={false}
            enableProse={false}
          />

          <aside className={styles.conclusion}>
            <span className={styles.conclusionLabel}>Conclusion</span>
            <p className={styles.conclusionText}>{post.excerpt}</p>
          </aside>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className={styles.relatedPosts}
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
