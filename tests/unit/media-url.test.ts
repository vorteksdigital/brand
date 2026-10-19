import { describe, expect, it } from 'vitest'

import { getMediaUrl } from '@/utilities/getMediaUrl'

describe('getMediaUrl', () => {
  it('serves Payload files from the committed static media directory', () => {
    expect(getMediaUrl('/api/media/file/joburg-cbd-traffic.webp')).toBe(
      '/media/joburg-cbd-traffic.webp',
    )
  })

  it('preserves external URLs and cache tags', () => {
    expect(getMediaUrl('https://cdn.example.com/image.webp', 'updated now')).toBe(
      'https://cdn.example.com/image.webp?updated%20now',
    )
  })
})
