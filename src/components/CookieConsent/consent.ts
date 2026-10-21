export const ANALYTICS_CONSENT_EVENT = 'vrtks:analytics-consent'
export const ANALYTICS_CONSENT_KEY = 'vrtks-analytics-consent'

export function hasAnalyticsConsent(value: string | null): boolean {
  return value === 'granted'
}
