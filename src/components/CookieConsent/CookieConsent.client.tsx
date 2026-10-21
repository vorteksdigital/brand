'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  type AnalyticsConsent,
  createAnalyticsConsent,
  readAnalyticsConsent,
} from './consent'
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
          readAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY))
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

  const saveConsent = (status: AnalyticsConsent) => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, createAnalyticsConsent(status))
    } catch {
      // The current page can still honor consent when storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: status }))
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
        We use optional analytics cookies to understand site use. Choose whether to allow them.{' '}
        <Link className={styles.policyLink} href="/cookie-policy" prefetch={false}>
          Cookie Policy
        </Link>
      </p>
      <div className={styles.actions}>
        <button
          className={styles.acceptButton}
          onClick={() => saveConsent('granted')}
          type="button"
        >
          Accept
        </button>
        <button className={styles.rejectButton} onClick={() => saveConsent('denied')} type="button">
          Reject
        </button>
      </div>
    </aside>
  )
}
