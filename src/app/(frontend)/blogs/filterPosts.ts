import type { BlogPostData } from './types'

export function filterPosts(posts: BlogPostData[], activeSlug: string): BlogPostData[] {
  if (activeSlug === 'all') return posts

  return posts.filter((post) =>
    post.categories.some((category) => category.slug === activeSlug),
  )
}
