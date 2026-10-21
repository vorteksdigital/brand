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
    let armed = false

    const interactionEvents: Array<keyof WindowEventMap> = [
      'keydown',
      'pointerdown',
      'touchstart',
      'wheel',
    ]

    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, loadAnalytics))
    }

    const loadAnalytics = () => {
      if (loaded) return
      loaded = true
      removeInteractionListeners()

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

    const armAnalytics = () => {
      if (armed || loaded) return
      armed = true
      interactionEvents.forEach((eventName) =>
        window.addEventListener(eventName, loadAnalytics, { passive: true }),
      )
    }

    try {
      if (hasAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY))) {
        armAnalytics()
      }
    } catch {
      // Analytics stays disabled when consent storage cannot be read.
    }

    const handleConsent = (event: Event) => {
      if (event instanceof CustomEvent && event.detail === 'granted') loadAnalytics()
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent)

    return () => {
      removeInteractionListeners()
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent)
    }
  }, [])

  return null
}
