import { describe, expect, it } from 'vitest'

import { filterPosts } from '@/app/(frontend)/blogs/filterPosts'
import type { BlogPostData } from '@/app/(frontend)/blogs/types'

const posts: BlogPostData[] = [
  {
    categories: [{ id: 1, slug: 'design', title: 'Design' }],
    excerpt: 'Design article',
    heroImage: null,
    id: 1,
    slug: 'design-article',
    title: 'Design article',
  },
  {
    categories: [{ id: 2, slug: 'technology', title: 'Technology' }],
    excerpt: 'Technology article',
    heroImage: null,
    id: 2,
    slug: 'technology-article',
    title: 'Technology article',
  },
]

describe('blog feed filtering', () => {
  it('returns the original feed for the All filter', () => {
    expect(filterPosts(posts, 'all')).toBe(posts)
  })

  it('returns posts assigned to the selected category slug', () => {
    expect(filterPosts(posts, 'design')).toEqual([posts[0]])
    expect(filterPosts(posts, 'missing')).toEqual([])
  })
})
