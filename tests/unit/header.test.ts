import { describe, expect, it } from 'vitest'

import {
  defaultHeaderNavItems,
  formatSouthAfricaTime,
  getLocationAndTime,
  getNavHref,
  isActiveRoute,
} from '@/Header/utilities'

describe('header utilities', () => {
  it('links the default navigation to the public routes', () => {
    expect(defaultHeaderNavItems.map(({ link }) => link.url)).toEqual([
      '/projects',
      '/approach',
      '/about',
      '/blogs',
      '/contact',
    ])
  })

  it('formats local time independently of the server timezone', () => {
    const winterNoon = new Date('2026-07-31T10:05:00.000Z')

    expect(formatSouthAfricaTime(winterNoon)).toBe('12:05 pm')
    expect(getLocationAndTime(winterNoon)).toBe('johannesburg 12:05 pm')
  })

  it('resolves custom and populated reference links', () => {
    expect(getNavHref({ label: 'Contact', type: 'custom', url: '/contact' })).toBe('/contact')
    expect(
      getNavHref({
        label: 'Article',
        reference: {
          relationTo: 'posts',
          value: { slug: 'brand-systems' },
        },
        type: 'reference',
      }),
    ).toBe('/posts/brand-systems')
  })

  it('does not guess a URL for an unpopulated reference', () => {
    expect(
      getNavHref({
        label: 'About',
        reference: { relationTo: 'pages', value: 42 },
        type: 'reference',
      }),
    ).toBeNull()
  })

  it('matches only the current internal route branch', () => {
    expect(isActiveRoute('/', '/')).toBe(true)
    expect(isActiveRoute('/posts/example', '/posts')).toBe(true)
    expect(isActiveRoute('/posters', '/posts')).toBe(false)
    expect(isActiveRoute('/contact', 'mailto:info@vorteksdigital.co.za')).toBe(false)
  })
})
