import { describe, expect, it } from 'vitest'

import {
  ANALYTICS_CONSENT_MAX_AGE,
  createAnalyticsConsent,
  hasAnalyticsConsent,
  readAnalyticsConsent,
} from '@/components/CookieConsent/consent'

describe('analytics consent', () => {
  it('grants analytics only for the explicit stored value', () => {
    const now = 1_800_000_000_000

    expect(hasAnalyticsConsent(createAnalyticsConsent('granted', now), now)).toBe(true)
    expect(hasAnalyticsConsent(createAnalyticsConsent('denied', now), now)).toBe(false)
    expect(hasAnalyticsConsent(null, now)).toBe(false)
    expect(hasAnalyticsConsent('granted', now)).toBe(false)
  })

  it('expires stored consent after 180 days', () => {
    const createdAt = 1_800_000_000_000
    const consent = createAnalyticsConsent('granted', createdAt)

    expect(readAnalyticsConsent(consent, createdAt + ANALYTICS_CONSENT_MAX_AGE)).toBe('granted')
    expect(readAnalyticsConsent(consent, createdAt + ANALYTICS_CONSENT_MAX_AGE + 1)).toBeNull()
  })
})
