import { ArrowDown } from 'lucide-react'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatEditorialDate, getReadingTime } from '@/utilities/postPresentation'

import styles from './index.module.css'
import { SmoothScrollLink } from './SmoothScrollLink.client'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, content, excerpt, heroImage, publishedAt, title } = post
  const category = categories?.find(
    (item): item is Exclude<typeof item, number> => typeof item === 'object' && item !== null,
  )
  const formattedDate = formatEditorialDate(publishedAt)
  const readingTime = getReadingTime(content)

  return (
    <header className={styles.hero}>
      <div className={styles.intro}>
        <dl className={styles.meta} aria-label="Article details">
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Date</dt>
            <dd className={styles.metaValue}>
              {formattedDate ? <time dateTime={publishedAt || undefined}>{formattedDate}</time> : '—'}
            </dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Category</dt>
            <dd className={styles.metaValue}>{category?.title || 'Insights'}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Reading time</dt>
            <dd className={styles.metaValue}>{readingTime} Min</dd>
          </div>
        </dl>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.excerpt}>{excerpt}</p>

        <SmoothScrollLink className={styles.readMore} targetId="article-content">
          <span aria-hidden="true" className={styles.readMoreIcon}>
            <ArrowDown size={14} strokeWidth={1.8} />
          </span>
          <span className={styles.readMoreText}>Read article</span>
        </SmoothScrollLink>
      </div>

      {heroImage && typeof heroImage === 'object' && (
        <div className={styles.media}>
          <Media
            fill
            priority
            imgClassName={styles.image}
            pictureClassName={styles.picture}
            resource={heroImage}
            size="(max-width: 768px) 100vw, 76rem"
          />
        </div>
      )}
    </header>
  )
}
