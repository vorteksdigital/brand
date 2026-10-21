'use client'

import { ANALYTICS_CONSENT_KEY, createAnalyticsConsent } from './consent'

import styles from './cookiePreferences.module.css'

function clearGoogleAnalyticsCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim()
    if (!name || (name !== '_ga' && !name.startsWith('_ga_'))) return

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}; SameSite=Lax`
  })
}

export function CookiePreferences() {
  const updateConsent = (status: 'denied' | 'granted') => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, createAnalyticsConsent(status))

    if (status === 'denied') clearGoogleAnalyticsCookies()
    window.location.reload()
  }

  return (
    <div className={styles.actions}>
      <button onClick={() => updateConsent('granted')} type="button">
        Accept analytics
      </button>
      <button onClick={() => updateConsent('denied')} type="button">
        Reject analytics
      </button>
    </div>
  )
}
