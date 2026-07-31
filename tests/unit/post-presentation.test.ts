import { describe, expect, it } from 'vitest'

import { formatEditorialDate, getReadingTime } from '@/utilities/postPresentation'

describe('post presentation utilities', () => {
  it('formats editorial dates with stable UTC ordinals', () => {
    expect(formatEditorialDate('2026-07-01T23:30:00.000Z')).toBe('1st July 2026')
    expect(formatEditorialDate('2026-07-02T07:00:00.000Z')).toBe('2nd July 2026')
    expect(formatEditorialDate('2026-07-03T07:00:00.000Z')).toBe('3rd July 2026')
    expect(formatEditorialDate('2026-07-11T07:00:00.000Z')).toBe('11th July 2026')
    expect(formatEditorialDate('2026-07-21T07:00:00.000Z')).toBe('21st July 2026')
    expect(formatEditorialDate('not-a-date')).toBe('')
  })

  it('calculates reading time from nested Lexical text only', () => {
    const content = {
      root: {
        children: [
          { children: [{ text: 'one two three four' }], type: 'paragraph' },
          {
            fields: {
              content: {
                root: { children: [{ children: [{ text: 'five six' }], type: 'paragraph' }] },
              },
            },
            type: 'block',
          },
        ],
      },
    }

    expect(getReadingTime(content, 3)).toBe(2)
    expect(getReadingTime({ root: { children: [] } })).toBe(1)
  })
})
