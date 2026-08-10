'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export function HeroImageReveal() {
  useGSAP(() => {
    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const media = Array.from(
        document.querySelectorAll<HTMLElement>('[data-hero-image-reveal]'),
      )
      const mediaTweens = media.map((element) =>
        gsap.fromTo(
          element,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            delay: 0.9,
            duration: 0.5,
            ease: 'expo.inOut',
          },
        ),
      )
      const desktopShift = gsap.matchMedia()

      desktopShift.add('(min-width: 768px)', () => {
        const shiftTweens = media.flatMap((element) => {
          const wrap = element.closest<HTMLElement>('[data-hero-title-wrap]')
          const shift = wrap?.querySelector<HTMLElement>('[data-hero-image-shift]')

          if (!shift) return []

          return gsap.fromTo(
            shift,
            { x: 0 },
            {
              delay: 0.75,
              duration: 1,
              ease: 'expo.inOut',
              x: () => element.getBoundingClientRect().width * (20 / 17.5),
            },
          )
        })

        return () => shiftTweens.forEach((tween) => tween.revert())
      })

      return () => {
        desktopShift.revert()
        mediaTweens.forEach((tween) => tween.revert())
      }
    })

    return () => motion.revert()
  }, [])

  return null
}
