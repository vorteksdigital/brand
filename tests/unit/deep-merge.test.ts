import { describe, expect, it } from 'vitest'

import deepMerge, { isObject } from '@/utilities/deepMerge'

describe('deepMerge', () => {
  it('merges nested records without mutating either input', () => {
    const target = { admin: { width: '50%', hidden: false }, label: 'Link' }
    const source = { admin: { hidden: true }, required: true }

    expect(deepMerge(target, source)).toEqual({
      admin: { width: '50%', hidden: true },
      label: 'Link',
      required: true,
    })
    expect(target.admin.hidden).toBe(false)
    expect(source.admin.hidden).toBe(true)
  })

  it('replaces arrays and handles null as a value', () => {
    expect(
      deepMerge({ fields: ['old'], value: { nested: true } }, { fields: ['new'], value: null }),
    ).toEqual({
      fields: ['new'],
      value: null,
    })
  })

  it('recognises only non-null, non-array objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject([])).toBe(false)
  })
})
