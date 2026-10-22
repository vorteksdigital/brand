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
const VRTKS_LOGO_PATH =
  'M193.271,0l0.027,0.04052c4.21357,0 8.20574,1.0793 11.70104,2.98201c0.34265,-1.71861 1.86645,-3.02253 3.68296,-3.02253h102.407c2.067,0 3.755,1.68833 3.755,3.75484v19.07136h54.85l18.032,-21.48905c0.715,-0.85091 1.755,-1.33715 2.876,-1.33715h13.845c0.85744,0 1.65551,0.27956 2.30051,0.77727c1.79,-0.50628 3.67769,-0.77727 5.62749,-0.77727h81.242c2.067,0 3.755,1.68833 3.755,3.75484v10.61616c0,2.0665 -1.688,3.7549 -3.755,3.7549h-81.269c-1.405,0 -2.607,1.1886 -2.607,2.6068c0,1.4181 1.189,2.6202 2.594,2.6202h66.898c6.186,0 12.007,2.7419 15.965,7.5232c5.159,6.2266 6.226,14.6547 2.769,22.0158c-3.445,7.3476 -10.617,11.9128 -18.694,11.9128h-81.282c-1.00848,0 -1.92674,-0.40188 -2.60275,-1.0535h-4.78625c-1.134,0 -2.147,-0.4727 -2.876,-1.3371l-18.032,-21.4756h-54.85v19.0714c0,2.0665 -1.688,3.7548 -3.755,3.7548h-10.616c-2.067,0 -3.755,-1.6883 -3.755,-3.7548v-41.884h-28.54v42.9375c0,2.0665 -1.688,3.7548 -3.754,3.7548h-10.617c-2.066,0 -3.754,-1.6883 -3.754,-3.7548v-42.924h-33.01371c0.41772,1.51264 0.69419,3.08426 0.81371,4.7003c0.054,0.5943 0.054,1.2021 0.054,1.8099c0,0.6078 -0.014,1.2291 -0.054,1.8369c-0.527,7.0774 -4.093,13.5201 -9.711,17.7747l12.426,14.3575c0.959,1.1211 1.188,2.6608 0.567,4.0115c-0.608,1.3506 -1.918,2.188 -3.404,2.188h-13.965c-1.121,0 -2.121,-0.4727 -2.85,-1.3101l-12.237,-14.2495h-58.403c-1.405,0 -2.607,1.1886 -2.607,2.6068v9.198c0,2.0665 -1.688,3.7548 -3.755,3.7548h-10.616c-2.066,0 -3.755,-1.6883 -3.755,-3.7548v-9.198c0,-11.4266 9.293,-20.7192 20.72,-20.7192h63.008c3.296,0 6.132,-2.5527 6.483,-5.8213c0.027,-0.2161 0.027,-0.4592 0.027,-0.6888c0,-0.2297 -0.013,-0.4728 -0.04,-0.7024c-0.338,-3.2416 -3.188,-5.7943 -6.47,-5.7943l-78.18832,0l-31.16138,37.1567l-0.0541,0.0405c-5.3216,6.186 -12.4666,9.4681 -20.6246,9.4681h-0.4592c-8.3065,0 -15.5056,-3.3496 -20.8272,-9.6977l-41.07358,-48.94798c-0.94546,-1.12105 -1.14806,-2.66081 -0.52676,-3.99796c0.63481,-1.33716 1.93145,-2.16106 3.40367,-2.16106h13.87127c1.1076,0 2.1611,0.49975 2.8769,1.35066l35.2793,42.08664c1.8639,2.2151 4.079,3.2551 6.9829,3.2551h0.4592c2.8769,0 5.092,-1.04 6.9559,-3.2551l35.32,-42.10015c0.716,-0.85091 1.756,-1.33715 2.877,-1.33715zM391.9895,24.44587l-6.2355,7.42973l12.41638,14.8033l81.06262,0c1.432,0 2.647,-1.2021 2.647,-2.6068c0,-1.4047 -1.188,-2.6068 -2.607,-2.6068h-66.871c-10.17144,0 -18.65591,-7.35666 -20.4125,-17.01943z'
const PRELOADER_CLIP_ID = 'preloader-top-down-reveal'
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
  const preloaderRef = useRef<HTMLDivElement>(null)
  const preloaderLogoOutlineRef = useRef<SVGPathElement>(null)
  const preloaderLogoDrawingRef = useRef<SVGPathElement>(null)
  const preloaderLogoFillRef = useRef<SVGPathElement>(null)
  const preloaderRevealRef = useRef<SVGRectElement>(null)
  const preloaderTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const bodyOverflowRef = useRef('')
  const brandSequenceCompleteRef = useRef(false)
  const pageLoadedRef = useRef(false)
  const preloaderExitStartedRef = useRef(false)
  const outgoingRef = useRef<HTMLElement | null>(null)
  const pendingSnapshotRef = useRef<HTMLElement | null>(null)
  const stableSnapshotRef = useRef<HTMLElement | null>(null)
  const pendingScrollRef = useRef(0)
  const pendingTimerRef = useRef<number | null>(null)
  const snapshotHostRef = useRef<HTMLDivElement>(null)
  const [preloading, setPreloading] = useState(true)
  const [pending, setPending] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const captureCurrentFrame = useCallback((scrollY: number) => {
    const currentFrame = currentFrameRef.current
    if (!currentFrame) return null

    return prepareSnapshot(currentFrame, scrollY)
  }, [])

  const restoreBodyOverflow = useCallback(() => {
    document.body.style.overflow = bodyOverflowRef.current
  }, [])

  const exitPreloader = useCallback(() => {
    const preloader = preloaderRef.current
    if (
      !preloader ||
      !pageLoadedRef.current ||
      !brandSequenceCompleteRef.current ||
      preloaderExitStartedRef.current
    ) {
      return
    }

    preloaderExitStartedRef.current = true
    const finish = () => {
      restoreBodyOverflow()
      setPreloading(false)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(preloader, { yPercent: 100 })
      finish()
      return
    }

    gsap.to(preloader, {
      duration: 0.8,
      ease: 'power4.inOut',
      force3D: true,
      onComplete: finish,
      yPercent: 100,
    })
  }, [restoreBodyOverflow])

  const startBrandSequence = useCallback(() => {
    if (brandSequenceCompleteRef.current || preloaderTimelineRef.current) return

    const outline = preloaderLogoOutlineRef.current
    const drawing = preloaderLogoDrawingRef.current
    const fill = preloaderLogoFillRef.current
    const reveal = preloaderRevealRef.current
    if (!outline || !drawing || !fill || !reveal) return

    const completeBrandSequence = () => {
      brandSequenceCompleteRef.current = true
      exitPreloader()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([outline, drawing], { autoAlpha: 0 })
      gsap.set(fill, { autoAlpha: 1 })
      completeBrandSequence()
      return
    }

    gsap.set(outline, {
      autoAlpha: 0.24,
      fill: 'transparent',
      stroke: '#fff',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 1,
    })
    gsap.set(drawing, {
      autoAlpha: 1,
      fill: 'transparent',
      stroke: '#fff',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 1,
    })
    gsap.set(reveal, { scaleY: 0, transformBox: 'fill-box', transformOrigin: '50% 0%' })
    gsap.set(fill, { autoAlpha: 0 })

    const timeline = gsap
      .timeline({ onComplete: completeBrandSequence })
      .to(reveal, { scaleY: 1, duration: 1.8, ease: 'power2.inOut' })
      .to(fill, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' }, '-=0.05')
      .to([outline, drawing], { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, '<')

    preloaderTimelineRef.current = timeline
  }, [exitPreloader])

  useLayoutEffect(() => startBrandSequence(), [startBrandSequence])

  useEffect(() => {
    const preloader = preloaderRef.current
    bodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const markPageLoaded = () => {
      pageLoadedRef.current = true
      exitPreloader()
    }

    if (document.readyState === 'complete') {
      markPageLoaded()
    } else {
      window.addEventListener('load', markPageLoaded, { once: true })
    }

    const fallbackTimer = window.setTimeout(() => {
      brandSequenceCompleteRef.current = true
      exitPreloader()
    }, 5000)

    return () => {
      window.removeEventListener('load', markPageLoaded)
      window.clearTimeout(fallbackTimer)
      preloaderTimelineRef.current?.kill()
      if (preloader) gsap.killTweensOf(preloader)
      restoreBodyOverflow()
    }
  }, [exitPreloader, restoreBodyOverflow])

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
        aria-hidden="true"
        className={styles.preloader}
        data-active={preloading}
        data-site-preloader
        ref={preloaderRef}
      >
        <div className={styles.preloaderLogo}>
          <svg
            aria-hidden="true"
            className={styles.preloaderLogoSvg}
            data-preloader-logo
            fill="none"
            viewBox="0 0 500 65"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={PRELOADER_CLIP_ID}>
                <rect height="65" ref={preloaderRevealRef} width="500" x="0" y="0" />
              </clipPath>
            </defs>
            <path
              className={styles.preloaderLogoOutline}
              d={VRTKS_LOGO_PATH}
              data-preloader-unified-outline
              ref={preloaderLogoOutlineRef}
            />
            <path
              className={styles.preloaderLogoDrawing}
              clipPath={`url(#${PRELOADER_CLIP_ID})`}
              d={VRTKS_LOGO_PATH}
              data-preloader-unified-drawing
              ref={preloaderLogoDrawingRef}
            />
            <path
              className={styles.preloaderLogoFill}
              d={VRTKS_LOGO_PATH}
              fill="white"
              ref={preloaderLogoFillRef}
            />
          </svg>
        </div>
      </div>
      <div
        aria-busy={preloading || pending}
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
