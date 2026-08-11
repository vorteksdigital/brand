'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import styles from './pageTransition.module.css'

gsap.registerPlugin(CustomEase, useGSAP)

const VUCKO_SNAPPY =
  'M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1'

type Props = {
  children: ReactNode
  footer: ReactNode
}

const isModifiedClick = (event: MouseEvent) =>
  event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey

const prepareSnapshot = (source: HTMLElement, scrollY: number) => {
  const snapshot = source.cloneNode(true) as HTMLElement

  snapshot.className = `${styles.frame} ${styles.outgoing}`
  snapshot.dataset.pageTransitionFrame = 'outgoing'
  snapshot.dataset.pageTransitionOutgoing = ''
  snapshot.setAttribute('aria-hidden', 'true')
  snapshot.setAttribute('inert', '')
  snapshot.style.top = `${-scrollY}px`
  snapshot.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))

  const shade = document.createElement('span')
  shade.className = styles.shade
  shade.dataset.pageTransitionShade = ''
  shade.setAttribute('aria-hidden', 'true')
  snapshot.append(shade)

  return snapshot
}

export function PageTransition({ children, footer }: Props) {
  const pathname = usePathname()
  const activePathRef = useRef(pathname)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentFrameRef = useRef<HTMLDivElement>(null)
  const outgoingRef = useRef<HTMLElement | null>(null)
  const pendingSnapshotRef = useRef<HTMLElement | null>(null)
  const stableSnapshotRef = useRef<HTMLElement | null>(null)
  const pendingScrollRef = useRef(0)
  const pendingTimerRef = useRef<number | null>(null)
  const snapshotHostRef = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const captureCurrentFrame = useCallback((scrollY: number) => {
    const currentFrame = currentFrameRef.current
    if (!currentFrame) return null

    return prepareSnapshot(currentFrame, scrollY)
  }, [])

  useEffect(() => {
    const clearPendingTimer = () => {
      if (pendingTimerRef.current === null) return
      window.clearTimeout(pendingTimerRef.current)
      pendingTimerRef.current = null
    }
    const markPending = () => {
      pendingScrollRef.current = window.scrollY
      pendingSnapshotRef.current = captureCurrentFrame(pendingScrollRef.current)
      setPending(true)
      clearPendingTimer()
      pendingTimerRef.current = window.setTimeout(() => setPending(false), 8000)
    }
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return

      const target = event.target
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null
      if (!link || link.download || link.target === '_blank') return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      if (destination.pathname === window.location.pathname) return

      markPending()
    }

    document.addEventListener('click', handleClick, true)
    window.addEventListener('popstate', markPending)

    return () => {
      clearPendingTimer()
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', markPending)
    }
  }, [captureCurrentFrame])

  useLayoutEffect(() => {
    if (activePathRef.current === pathname) return

    activePathRef.current = pathname
    window.scrollTo({ behavior: 'instant', left: 0, top: 0 })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pendingSnapshotRef.current = null
      outgoingRef.current = null
      snapshotHostRef.current?.replaceChildren()
      queueMicrotask(() => {
        flushSync(() => {
          setPending(false)
          setTransitioning(false)
        })
      })
      return
    }

    const outgoing =
      pendingSnapshotRef.current ??
      (stableSnapshotRef.current
        ? prepareSnapshot(stableSnapshotRef.current, pendingScrollRef.current)
        : null)
    pendingSnapshotRef.current = null

    if (!outgoing || !snapshotHostRef.current) {
      queueMicrotask(() => {
        flushSync(() => {
          setPending(false)
          setTransitioning(false)
        })
      })
      return
    }

    snapshotHostRef.current.replaceChildren(outgoing)
    outgoingRef.current = outgoing
    queueMicrotask(() => {
      flushSync(() => {
        setPending(true)
        setTransitioning(true)
        setTransitionKey((current) => current + 1)
      })
    })
  }, [pathname])

  useEffect(() => {
    if (transitioning || !currentFrameRef.current) return
    stableSnapshotRef.current = currentFrameRef.current.cloneNode(true) as HTMLElement
  }, [children, pathname, transitioning])

  useLayoutEffect(() => {
    if (transitioning || !currentFrameRef.current) return

    gsap.set(currentFrameRef.current, { clearProps: 'transform' })

    if (!document.querySelector('[data-menu-open="true"]')) {
      document.body.style.removeProperty('overflow')
    }
  }, [transitioning])

  useGSAP(
    () => {
      if (!transitioning || transitionKey === 0) return

      const outgoing = outgoingRef.current
      const incoming = currentFrameRef.current
      const shade = outgoing?.querySelector<HTMLElement>('[data-page-transition-shade]')
      if (!outgoing || !incoming || !shade) return

      CustomEase.create('vucko-page-snappy', VUCKO_SNAPPY)
      const previousBodyOverflow = document.body.style.overflow
      let overflowRestored = false
      const restoreOverflow = () => {
        if (overflowRestored) return
        overflowRestored = true
        document.body.style.overflow = previousBodyOverflow
      }
      document.body.style.overflow = 'hidden'

      const timeline = gsap.timeline({
        defaults: { duration: 1.25, ease: 'vucko-page-snappy', immediateRender: true },
        onComplete: () => {
          snapshotHostRef.current?.replaceChildren()
          outgoingRef.current = null
          stableSnapshotRef.current = incoming.cloneNode(true) as HTMLElement
          setTransitioning(false)
          setPending(false)
          restoreOverflow()
          window.dispatchEvent(new Event('resize'))
        },
      })

      timeline
        .to(
          shade,
          {
            autoAlpha: document.documentElement.dataset.theme === 'dark' ? 0.75 : 0.5,
            duration: 0.5,
            ease: 'none',
          },
          0,
        )
        .to(outgoing, { force3D: true, y: () => -0.15 * window.innerHeight }, 0)
        .fromTo(
          incoming,
          { y: () => window.innerHeight },
          { force3D: true, y: 0 },
          0,
        )

      return () => {
        timeline.kill()
        restoreOverflow()
      }
    },
    { dependencies: [transitionKey, transitioning], scope: containerRef },
  )

  return (
    <>
      <div
        aria-busy={pending}
        className={styles.root}
        data-page-transition
        data-page-transition-state={transitioning ? 'running' : 'idle'}
        ref={containerRef}
      >
        <div aria-hidden="true" className={styles.snapshotHost} ref={snapshotHostRef} />
        <div
          className={`${styles.frame} ${transitioning ? styles.incoming : ''}`}
          data-page-transition-frame={transitioning ? 'incoming' : 'current'}
          data-page-transition-incoming={transitioning ? '' : undefined}
          ref={currentFrameRef}
        >
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          {footer}
        </div>
      </div>
      <span
        aria-hidden="true"
        className={styles.blocker}
        data-active={pending}
        data-page-transition-blocker
      />
    </>
  )
}
