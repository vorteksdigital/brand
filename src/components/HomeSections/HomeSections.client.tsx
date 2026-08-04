'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText, useGSAP)

export function HomeSectionsAnimations() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>('[data-home-sections]')
    if (!root) return

    const select = gsap.utils.selector(root)
    const motion = gsap.matchMedia()

    CustomEase.create('home-unmask', 'M0,0 C0.2,0 0,1 1,1')
    CustomEase.create(
      'home-snappy',
      'M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1',
    )

    const getDesignUnit = () => Number.parseFloat(getComputedStyle(root).fontSize) / 1.8 || 10

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const splits: SplitText[] = []
      const splitTweens: gsap.core.Tween[] = []

      select<HTMLElement>('[data-home-lines]').forEach((element) => {
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
              ease: 'home-unmask',
              onComplete: () => {
                revealed = true
                gsap.set(currentSplit.lines, { clearProps: 'transform' })
              },
              stagger: 0.1,
              scrollTrigger: {
                once: true,
                start: 'top 85%',
                trigger: element,
              },
              yPercent: 100,
            })
            splitTweens.push(tween)
          },
          type: 'lines',
        })
        splits.push(split)
      })

      select<HTMLElement>('[data-home-fade]').forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            once: true,
            start: 'top 85%',
            trigger: element,
          },
          y: () => getDesignUnit() * 3,
        })
      })

      select<HTMLElement>('[data-home-arrow]').forEach((element) => {
        const arrows = Array.from(element.querySelectorAll('svg'))
        gsap.fromTo(
          arrows,
          { xPercent: (index) => (index === 0 ? -150 : 0) },
          {
            delay: 0.5,
            duration: 1,
            ease: 'home-snappy',
            scrollTrigger: {
              once: true,
              start: 'top 85%',
              trigger: element,
            },
            stagger: -0.25,
            xPercent: (index) => (index === 0 ? 0 : 100),
          },
        )
      })

      select<HTMLElement>('[data-home-project]').forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            once: true,
            start: 'top 90%',
            trigger: element,
          },
          y: () => getDesignUnit() * 3,
        })
      })

      let refreshFrame: number | null = null
      const requestRefresh = () => {
        if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = null
          ScrollTrigger.refresh()
        })
      }
      const observer = new ResizeObserver(requestRefresh)
      observer.observe(root)
      let cancelled = false
      void document.fonts.ready.then(() => {
        if (!cancelled) requestRefresh()
      })

      return () => {
        cancelled = true
        if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
        observer.disconnect()
        splitTweens.forEach((tween) => tween.kill())
        splits.forEach((split) => split.revert())
      }
    })

    return () => motion.revert()
  }, [])

  return null
}
