'use client'

import styles from './blog.module.scss'
import type { BlogCategoryData } from './types'

type Props = {
  activeSlug?: string
  categories?: BlogCategoryData[]
  onChange: (slug: string) => void
}

export function FilterBar({ categories = [], activeSlug = 'all', onChange }: Props) {
  const tabs: BlogCategoryData[] = [
    { id: 0, title: 'All', slug: 'all' },
    ...categories,
  ]

  return (
    <nav aria-label="Blog categories" className={styles['filter-bar']}>
      <ul className={styles['filter-bar__list']} role="list">
        {tabs.map((category) => (
          <li className={styles['filter-bar__item']} key={category.id || category.slug}>
            <button
              aria-pressed={activeSlug === category.slug}
              className={`${styles['filter-bar__btn']}${
                activeSlug === category.slug ? ` ${styles['filter-bar__btn--active']}` : ''
              }`}
              onClick={() => onChange(category.slug)}
              type="button"
            >
              {category.title || 'Untitled'}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
