'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

import { FluidSimulation } from './fluidSimulation'
import styles from './index.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type BoxValues = {
  height: number
  left: number
  top: number
  width: number
}

export function HomeHero() {
  const fluidCanvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const videoContainerRef = useRef<HTMLSpanElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSlotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = fluidCanvasRef.current

    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let fluid: FluidSimulation | null = null

    const syncFluidPreference = () => {
      fluid?.destroy()
      fluid = null

      if (reducedMotion.matches) return

      try {
        fluid = new FluidSimulation(canvas)
      } catch (error) {
        console.warn('The homepage fluid effect could not be started.', error)
      }
    }

    syncFluidPreference()
    reducedMotion.addEventListener('change', syncFluidPreference)

    return () => {
      reducedMotion.removeEventListener('change', syncFluidPreference)
      fluid?.destroy()
    }
  }, [])

  useGSAP(
    () => {
      const hero = heroRef.current
      const videoContainer = videoContainerRef.current
      const videoSlot = videoSlotRef.current
      const video = videoRef.current

      if (!hero || !videoContainer || !videoSlot || !video) return

      const playVideo = () => {
        if (video.paused) {
          void video.play().catch(() => {
            // Muted autoplay may still be declined by browser or user settings.
          })
        }
      }

      const getStartValues = (): BoxValues => {
        const heroRect = hero.getBoundingClientRect()
        const slotRect = videoSlot.getBoundingClientRect()

        return {
          height: slotRect.height,
          left: slotRect.left - heroRect.left,
          top: slotRect.top - heroRect.top,
          width: slotRect.width,
        }
      }

      const getTargetValues = (): BoxValues => {
        const heroRect = hero.getBoundingClientRect()

        return {
          height: heroRect.height,
          left: 0,
          top: 0,
          width: heroRect.width,
        }
      }

      const setStartPosition = () => {
        gsap.set(videoContainer, {
          ...getStartValues(),
          borderRadius: '999px',
          opacity: 1,
        })
      }

      setStartPosition()

      const motionPreferences = gsap.matchMedia()

      motionPreferences.add('(prefers-reduced-motion: no-preference)', () => {
        playVideo()

        const timeline = gsap.timeline({
          scrollTrigger: {
            end: () => `+=${hero.getBoundingClientRect().height * 1.6}`,
            invalidateOnRefresh: true,
            pin: true,
            scrub: true,
            start: 'top top',
            trigger: hero,
          },
        })

        timeline.to(
          videoContainer,
          {
            ...Object.fromEntries(
              (['height', 'left', 'top', 'width'] satisfies Array<keyof BoxValues>).map(
                (property) => [property, () => getTargetValues()[property]],
              ),
            ),
            borderRadius: '20px',
            ease: 'none',
          },
          0,
        )

        return () => {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        }
      })

      motionPreferences.add('(prefers-reduced-motion: reduce)', () => {
        video.pause()
        setStartPosition()
      })

      let refreshFrame: number | null = null

      const requestRefresh = () => {
        if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame)

        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = null
          ScrollTrigger.refresh()
        })
      }

      const resizeObserver = new ResizeObserver(requestRefresh)
      resizeObserver.observe(hero)
      window.addEventListener('orientationchange', requestRefresh)
      window.visualViewport?.addEventListener('resize', requestRefresh)
      video.addEventListener('loadedmetadata', requestRefresh)

      let cancelled = false
      void document.fonts.ready.then(() => {
        if (!cancelled) requestRefresh()
      })

      return () => {
        cancelled = true
        if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame)
        resizeObserver.disconnect()
        window.removeEventListener('orientationchange', requestRefresh)
        window.visualViewport?.removeEventListener('resize', requestRefresh)
        video.removeEventListener('loadedmetadata', requestRefresh)
        motionPreferences.revert()
      }
    },
    { scope: heroRef },
  )

  return (
    <section aria-labelledby="home-hero-title" className={styles.hero} ref={heroRef}>
      <div aria-hidden="true" className={styles.stripeDivider} />

      <div className={styles.header}>
        <div className={styles.topLine}>
          <h1 id="home-hero-title">
            Shaping
            <span className="sr-only"> Tomorrow&apos;s brand Today</span>
          </h1>

          <p className={styles.description}>
            We craft immersive &amp; interactive digital experiences for brands that want to lead,
            not follow — since 2020.
          </p>
        </div>

        <div aria-hidden="true" className={`${styles.displayHeading} ${styles.centeredHeading}`}>
          Tomorrow&apos;s
        </div>

        <div aria-hidden="true" className={`${styles.displayHeading} ${styles.brandLine}`}>
          <span>brand</span>
          <span className={styles.videoSlot} ref={videoSlotRef} />
          <span>Today</span>
        </div>
      </div>

      <canvas aria-hidden="true" className={styles.fluidCanvas} ref={fluidCanvasRef} />

      <span aria-hidden="true" className={styles.videoPill} ref={videoContainerRef}>
        <video
          autoPlay
          className={styles.video}
          loop
          muted
          playsInline
          preload="metadata"
          ref={videoRef}
          tabIndex={-1}
        >
          <source src="/hero/brand-film.mp4" type="video/mp4" />
        </video>
      </span>
    </section>
  )
}
