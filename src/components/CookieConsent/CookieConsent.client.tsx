'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_KEY, hasAnalyticsConsent } from './consent'
import styles from './cookieConsent.module.css'

type NoticeState = 'checking' | 'closing' | 'hidden' | 'visible'

export function CookieConsent() {
  const [noticeState, setNoticeState] = useState<NoticeState>('checking')
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    queueMicrotask(() => {
      if (!mounted) return

      try {
        setNoticeState(
          hasAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY))
            ? 'hidden'
            : 'visible',
        )
      } catch {
        setNoticeState('visible')
      }
    })

    return () => {
      mounted = false
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const grantConsent = () => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted')
    } catch {
      // The current page can still honor consent when storage is unavailable.
    }

    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
    setNoticeState('closing')
    closeTimerRef.current = window.setTimeout(() => setNoticeState('hidden'), 450)
  }

  if (noticeState === 'checking' || noticeState === 'hidden') return null

  return (
    <aside
      aria-label="Cookie notice"
      className={styles.notice}
      data-closing={noticeState === 'closing' ? 'true' : undefined}
    >
      <p className={styles.copy}>
        This website uses cookies to improve your experience.{' '}
        <Link className={styles.policyLink} href="/cookie-policy" prefetch={false}>
          Cookie Policy
        </Link>
      </p>
      <button className={styles.acceptButton} onClick={grantConsent} type="button">
        Got it
      </button>
    </aside>
  )
}
