import { describe, expect, it } from 'vitest'

import {
  isAllowedPreviewOrigin,
  normaliseDraftBlocks,
  previewPath,
} from '../../packages/payload-visual-editor-compat/src'

describe('visual editor compatibility', () => {
  it('constructs safe Page and Post paths', () => {
    expect(previewPath('pages', 'home')).toBe('/')
    expect(previewPath('pages', 'about us')).toBe('/about%20us')
    expect(previewPath('posts', 'launch')).toBe('/posts/launch')
  })

  it('accepts only exact configured origins', () => {
    expect(isAllowedPreviewOrigin('https://example.com', 'https://example.com/app')).toBe(true)
    expect(isAllowedPreviewOrigin('https://evil.example', 'https://example.com')).toBe(false)
    expect(isAllowedPreviewOrigin('invalid', 'https://example.com')).toBe(false)
  })

  it('handles incomplete draft blocks', () => {
    expect(normaliseDraftBlocks(undefined)).toEqual([])
    expect(normaliseDraftBlocks([{ blockType: null }, { blockType: 'content' }])).toEqual([
      { blockType: 'content' },
    ])
  })
})
