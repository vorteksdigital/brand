'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

import styles from './about.module.css'

type ShowcaseImage = {
  alt: string
  src: string
}

type Props = {
  images: ShowcaseImage[]
}

type SlideMetric = {
  base: number
  element: HTMLElement
  width: number
}

const modulo = (value: number, range: number) => ((value % range) + range) % range

export function AboutShowcase({ images }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let current = 0
    let dragging = false
    let dragStartTarget = 0
    let dragStartX = 0
    let frame = 0
    let lastScrollY = window.scrollY
    let lastTime = performance.now()
    let metrics: SlideMetric[] = []
    let totalWidth = 0
    let target = 0

    const measure = () => {
      const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-about-showcase-slide]'))
      slides.forEach((slide) => {
        slide.style.transform = 'translate3d(0, 0, 0)'
      })

      const trackLeft = track.getBoundingClientRect().left
      metrics = slides.map((element) => {
        const bounds = element.getBoundingClientRect()
        return {
          base: bounds.left - trackLeft,
          element,
          width: bounds.width,
        }
      })

      const finalMetric = metrics.at(-1)
      if (!finalMetric) {
        totalWidth = 0
        return
      }

      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
      totalWidth = finalMetric.base + finalMetric.width + gap
    }

    const render = () => {
      if (!totalWidth) return
      metrics.forEach(({ base, element, width }) => {
        const wrappedPosition = modulo(base - current + width, totalWidth) - width
        element.style.transform = `translate3d(${wrappedPosition - base}px, 0, 0)`
      })
    }

    const tick = (time: number) => {
      const elapsed = Math.min(50, time - lastTime)
      lastTime = time
      target += elapsed * 0.06
      const smoothing = 1 - Math.pow(0.9, elapsed / (1000 / 60))
      current += (target - current) * smoothing
      render()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      lastTime = performance.now()
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick)
    }

    const syncMotionPreference = () => {
      track.dataset.reducedMotion = String(reducedMotion.matches)
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame)
        metrics.forEach(({ element }) => {
          element.style.transform = 'translate3d(0, 0, 0)'
        })
        return
      }
      start()
    }

    const handleScroll = () => {
      const nextScrollY = window.scrollY
      if (finePointer.matches && !reducedMotion.matches) {
        target += Math.abs(nextScrollY - lastScrollY) * 0.5
      }
      lastScrollY = nextScrollY
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return
      dragging = true
      dragStartX = event.clientX
      dragStartTarget = target
      section.dataset.dragging = 'true'
      section.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return
      target = dragStartTarget + (dragStartX - event.clientX) * 2
    }

    const handlePointerEnd = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete section.dataset.dragging
      if (section.hasPointerCapture(event.pointerId)) section.releasePointerCapture(event.pointerId)
    }

    const observer = new ResizeObserver(() => {
      measure()
      render()
    })
    observer.observe(section)
    observer.observe(track)
    section.addEventListener('pointerdown', handlePointerDown)
    section.addEventListener('pointermove', handlePointerMove)
    section.addEventListener('pointerup', handlePointerEnd)
    section.addEventListener('pointercancel', handlePointerEnd)
    window.addEventListener('scroll', handleScroll, { passive: true })
    reducedMotion.addEventListener('change', syncMotionPreference)

    measure()
    render()
    syncMotionPreference()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      section.removeEventListener('pointerdown', handlePointerDown)
      section.removeEventListener('pointermove', handlePointerMove)
      section.removeEventListener('pointerup', handlePointerEnd)
      section.removeEventListener('pointercancel', handlePointerEnd)
      window.removeEventListener('scroll', handleScroll)
      reducedMotion.removeEventListener('change', syncMotionPreference)
    }
  }, [])

  return (
    <section
      aria-label="Selected studio work"
      className={`${styles.showcase} content-section content-section--about-slider`}
      ref={sectionRef}
    >
      <div className={styles.showcaseTrack} data-about-showcase-track ref={trackRef}>
        {images.map((image) => (
          <div className={styles.showcaseImage} data-about-showcase-slide key={image.src}>
            <Image alt={image.alt} fill sizes="(max-width: 47.99rem) 90vw, 55vw" src={image.src} />
          </div>
        ))}
      </div>
    </section>
  )
}
