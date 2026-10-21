'use client'

import { useEffect } from 'react'

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

      removeListeners()
    }

    const removeListeners = () => {
      window.removeEventListener('keydown', loadAnalytics)
      window.removeEventListener('pointerdown', loadAnalytics)
      window.removeEventListener('touchstart', loadAnalytics)
      window.removeEventListener('wheel', loadAnalytics)
    }

    window.addEventListener('keydown', loadAnalytics, { passive: true })
    window.addEventListener('pointerdown', loadAnalytics, { passive: true })
    window.addEventListener('touchstart', loadAnalytics, { passive: true })
    window.addEventListener('wheel', loadAnalytics, { passive: true })

    return removeListeners
  }, [])

  return null
}
