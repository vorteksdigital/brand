'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export function HeroImageReveal() {
  useGSAP(() => {
    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const timelines = Array.from(
        document.querySelectorAll<HTMLElement>('[data-hero-image-reveal]'),
      ).map((media) => {
        const wrap = media.closest<HTMLElement>('[data-hero-title-wrap]')
        const shift = wrap?.querySelector<HTMLElement>('[data-hero-image-shift]')
        const timeline = gsap.timeline({ delay: 0.75 })

        if (shift && wrap) {
          timeline.fromTo(
            shift,
            { x: 0 },
            {
              duration: 1,
              ease: 'expo.inOut',
              x: () =>
                Number.parseFloat(
                  getComputedStyle(wrap).getPropertyValue('--hero-image-shift'),
                ) || 0,
            },
            0,
          )
        }

        timeline.fromTo(
          media,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.inOut' },
          0.15,
        )

        return timeline
      })

      return () => timelines.forEach((timeline) => timeline.revert())
    })

    return () => motion.revert()
  }, [])

  return null
}
