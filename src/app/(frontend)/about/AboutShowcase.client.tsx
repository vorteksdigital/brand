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

export function AboutShowcase({ images }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0

      if (reducedMotion.matches) {
        track.style.transform = 'translate3d(0, 0, 0)'
        return
      }

      const bounds = section.getBoundingClientRect()
      const range = window.innerHeight + bounds.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / range))
      const travel = Math.max(0, track.scrollWidth - section.clientWidth)

      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(section)
    observer.observe(track)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)
    update()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <section aria-label="Selected studio work" className={styles.showcase} ref={sectionRef}>
      <div className={styles.showcaseTrack} data-about-showcase-track ref={trackRef}>
        {images.map((image) => (
          <div className={styles.showcaseImage} key={image.src}>
            <Image alt={image.alt} fill sizes="(max-width: 48rem) 72vw, 31vw" src={image.src} />
          </div>
        ))}
      </div>
    </section>
  )
}
