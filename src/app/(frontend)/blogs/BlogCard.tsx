'use client'

import type { CSSProperties } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { getMediaUrl } from '@/utilities/getMediaUrl'

import styles from './blog.module.scss'
import type { BlogPostData } from './types'

type Props = {
  index?: number
  post: BlogPostData
}

export function BlogCard({ post, index = 0 }: Props) {
  const { categories, excerpt, heroImage, slug, title } = post
  const primaryCategory = categories.find((category) => category.title)?.title || ''
  const imageSource = heroImage?.url ? getMediaUrl(heroImage.url, heroImage.updatedAt) : null
  const imageAlt = heroImage?.alt || title || 'Blog image'
  const animationStyle = { '--delay': `${index * 55}ms` } as CSSProperties

  return (
    <article className={styles['blog-card']} style={animationStyle}>
      <Link className={styles['blog-card__link']} href={slug ? `/posts/${slug}` : '#'}>
        <div className={styles['blog-card__image-wrap']}>
          {imageSource ? (
            <Image
              alt={imageAlt}
              className={styles['blog-card__image']}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
              src={imageSource}
              width={900}
            />
          ) : (
            <div className={styles['blog-card__image-placeholder']} />
          )}
        </div>

        <div className={styles['blog-card__body']}>
          {primaryCategory && (
            <span className={styles['blog-card__category']}>{primaryCategory}</span>
          )}

          {title && <h2 className={styles['blog-card__title']}>{title}</h2>}

          {excerpt && <p className={styles['blog-card__excerpt']}>{excerpt}</p>}
        </div>
      </Link>
    </article>
  )
}
