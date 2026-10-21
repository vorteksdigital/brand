import { describe, expect, it } from 'vitest'

import { hasAnalyticsConsent } from '@/components/CookieConsent/consent'

describe('analytics consent', () => {
  it('grants analytics only for the explicit stored value', () => {
    expect(hasAnalyticsConsent('granted')).toBe(true)
    expect(hasAnalyticsConsent(null)).toBe(false)
    expect(hasAnalyticsConsent('denied')).toBe(false)
    expect(hasAnalyticsConsent('true')).toBe(false)
  })
})
