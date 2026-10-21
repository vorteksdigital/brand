'use client'

import { useEffect } from 'react'

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  hasAnalyticsConsent,
} from '@/components/CookieConsent/consent'

const measurementID = 'G-4FCPRY0JBF'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][]
  gtag?: (...args: unknown[]) => void
}

export function GoogleAnalytics() {
  useEffect(() => {
    let loaded = false

    const loadAnalytics = () => {
      if (loaded) return
      loaded = true

      const analyticsWindow = window as AnalyticsWindow
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
      analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.dataLayer?.push(args)
      analyticsWindow.gtag('js', new Date())
      analyticsWindow.gtag('config', measurementID)

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementID}`
      document.head.append(script)
    }

    try {
      if (hasAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY))) {
        loadAnalytics()
      }
    } catch {
      // Analytics stays disabled when consent storage cannot be read.
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, loadAnalytics)

    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, loadAnalytics)
  }, [])

  return null
}
