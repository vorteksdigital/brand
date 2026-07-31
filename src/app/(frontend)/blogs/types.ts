import type { Media } from '@/payload-types'

export type BlogCategoryData = {
  id: number
  slug: string
  title: string
}

export type BlogPostData = {
  categories: BlogCategoryData[]
  excerpt: string
  heroImage: Media | null
  id: number
  slug: string
  title: string
}
