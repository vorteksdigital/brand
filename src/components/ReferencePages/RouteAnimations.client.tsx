'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText, useGSAP)

export function RouteAnimations() {
  useGSAP(() => {
    const page = document.querySelector<HTMLElement>('[data-reference-route]')
    if (!page) return

    const select = gsap.utils.selector(page)
    const motion = gsap.matchMedia()
    const getUnit = () => Number.parseFloat(getComputedStyle(page).fontSize) / 1.8 || 10

    CustomEase.create('route-unmask', 'M0,0 C0.2,0 0,1 1,1')
    CustomEase.create(
      'route-snappy',
      'M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1',
    )

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const splits: SplitText[] = []
      const splitTweens: gsap.core.Tween[] = []
      page.dataset.routeMotion = 'running'
      const entrance = gsap.timeline({
        onComplete: () => {
          page.dataset.routeMotion = 'complete'
        },
      })

      entrance
        .from(page, {
          duration: 1.25,
          ease: 'route-snappy',
          force3D: true,
          onComplete: () => ScrollTrigger.refresh(),
          y: () => window.innerHeight,
        })
        .from(
          select('[data-route-hero-line]'),
          { duration: 1, ease: 'route-unmask', stagger: 0.1, yPercent: 105 },
          0.4,
        )
        .from(
          select('[data-route-hero-copy]'),
          { autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, y: () => getUnit() * 3 },
          0.7,
        )

      select<HTMLElement>('[data-route-lines]').forEach((element) => {
        let revealed = false
        let tween: gsap.core.Tween | null = null
        const split = SplitText.create(element, {
          aria: 'auto',
          autoSplit: true,
          mask: 'lines',
          onSplit: (currentSplit) => {
            tween?.kill()
            if (revealed) {
              gsap.set(currentSplit.lines, { clearProps: 'transform' })
              return
            }

            tween = gsap.from(currentSplit.lines, {
              duration: 1,
              ease: 'route-unmask',
              onComplete: () => {
                revealed = true
                gsap.set(currentSplit.lines, { clearProps: 'transform' })
              },
              scrollTrigger: {
                once: true,
                start: 'top 85%',
                trigger: element,
              },
              stagger: 0.1,
              yPercent: 105,
            })
            splitTweens.push(tween)
          },
          type: 'lines',
        })
        splits.push(split)
      })

      select<HTMLElement>('[data-route-fade]').forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            once: true,
            start: 'top 88%',
            trigger: element,
          },
          y: () => getUnit() * 3,
        })
      })

      const observer = new ResizeObserver(() => ScrollTrigger.refresh())
      observer.observe(page)

      return () => {
        delete page.dataset.routeMotion
        observer.disconnect()
        splitTweens.forEach((tween) => tween.kill())
        splits.forEach((split) => split.revert())
      }
    })

    motion.add('(prefers-reduced-motion: reduce)', () => {
      page.dataset.routeMotion = 'reduced'
      gsap.set(page, { clearProps: 'transform' })

      return () => {
        delete page.dataset.routeMotion
      }
    })

    return () => motion.revert()
  }, [])

  return null
}
