'use client'

import { useMemo, useState } from 'react'

import { BlogCard } from './BlogCard'
import { FilterBar } from './FilterBar'
import styles from './blog.module.scss'
import { filterPosts } from './filterPosts'
import type { BlogCategoryData, BlogPostData } from './types'

type Props = {
  categories?: BlogCategoryData[]
  initialPosts?: BlogPostData[]
}

export function BlogFeed({ initialPosts = [], categories = [] }: Props) {
  const [activeSlug, setActiveSlug] = useState('all')

  const posts = useMemo(() => filterPosts(initialPosts, activeSlug), [initialPosts, activeSlug])

  return (
    <section
      aria-labelledby="blogs-title"
      className={`${styles['blog-feed']} container c-container content-section`}
    >
      <FilterBar activeSlug={activeSlug} categories={categories} onChange={setActiveSlug} />

      <div className={styles['blog-feed__grid']} key={activeSlug}>
        {posts.length === 0 ? (
          <div className="blog-feed__empty">No posts found.</div>
        ) : (
          posts.map((post, index) => <BlogCard index={index} key={post.id} post={post} />)
        )}
      </div>
    </section>
  )
}
