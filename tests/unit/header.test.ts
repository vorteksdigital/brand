import { describe, expect, it } from 'vitest'

import {
  formatCapeTownTime,
  getLocationAndTime,
  getNavHref,
  isActiveRoute,
} from '@/Header/utilities'

describe('header utilities', () => {
  it('formats time in Cape Town independently of the server timezone', () => {
    const winterNoon = new Date('2026-07-31T10:05:00.000Z')

    expect(formatCapeTownTime(winterNoon)).toBe('12:05 pm')
    expect(getLocationAndTime(winterNoon)).toBe('CPT, SOUTH AFRICA 12:05 pm')
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
