export const ANALYTICS_CONSENT_EVENT = 'vrtks:analytics-consent'
export const ANALYTICS_CONSENT_KEY = 'vrtks-analytics-consent'
export const ANALYTICS_CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000

export type AnalyticsConsent = 'denied' | 'granted'

type StoredConsent = {
  createdAt: number
  status: AnalyticsConsent
  version: 1
}

export function createAnalyticsConsent(status: AnalyticsConsent, now = Date.now()): string {
  return JSON.stringify({ createdAt: now, status, version: 1 } satisfies StoredConsent)
}

export function readAnalyticsConsent(
  value: string | null,
  now = Date.now(),
): AnalyticsConsent | null {
  if (!value) return null

  try {
    const consent = JSON.parse(value) as Partial<StoredConsent>
    const isValidDate =
      typeof consent.createdAt === 'number' &&
      consent.createdAt <= now &&
      now - consent.createdAt <= ANALYTICS_CONSENT_MAX_AGE

    if (consent.version !== 1 || !isValidDate) return null
    if (consent.status === 'granted') return 'granted'
    if (consent.status === 'denied') return 'denied'

    return null
  } catch {
    return null
  }
}

export function hasAnalyticsConsent(value: string | null, now = Date.now()): boolean {
  return readAnalyticsConsent(value, now) === 'granted'
}
