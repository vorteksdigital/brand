'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText, useGSAP)

const getDesignUnit = (page: HTMLElement) => {
  const pageFontSize = Number.parseFloat(getComputedStyle(page).fontSize)
  return Number.isFinite(pageFontSize) ? pageFontSize / 1.8 : 10
}

export function AboutAnimations() {
  useGSAP(() => {
    const page = document.querySelector<HTMLElement>('[data-about-page]')
    if (!page) return

    const select = gsap.utils.selector(page)
    const motion = gsap.matchMedia()

    CustomEase.create('about-unmask', 'M0,0 C0.2,0 0,1 1,1')
    CustomEase.create(
      'about-snappy',
      'M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1',
    )

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const splits: SplitText[] = []
      const splitTweens: gsap.core.Tween[] = []
      let subtitleEntranceComplete = false
      let subtitleLines: Element[] = []
      const subtitle = page.querySelector<HTMLElement>('[data-about-subtitle]')
      if (subtitle) {
        const subtitleSplit = SplitText.create(subtitle, {
          aria: 'none',
          autoSplit: true,
          mask: 'lines',
          onSplit: (currentSplit) => {
            subtitleLines = currentSplit.lines
            if (subtitleEntranceComplete) gsap.set(subtitleLines, { clearProps: 'transform' })
          },
          type: 'lines',
        })
        splits.push(subtitleSplit)
      }

      const entrance = gsap.timeline({ defaults: { duration: 1, ease: 'about-unmask' } })
      entrance
        .from(select('[data-about-hero-line]'), { stagger: 0.1, yPercent: 100 }, 0.4)
        .fromTo(
          select('[data-about-hero-media]'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', ease: 'expo.inOut' },
          0.9,
        )
        .from(subtitleLines, { stagger: 0.1, yPercent: 100 }, 0.75)
        .call(() => {
          subtitleEntranceComplete = true
          ScrollTrigger.refresh()
        })

      const desktopShift = gsap.matchMedia()
      desktopShift.add('(min-width: 768px)', () => {
        const tween = gsap.to(select('[data-about-hero-shift]'), {
          delay: 0.75,
          duration: 1,
          ease: 'expo.inOut',
          x: () => getDesignUnit(page) * 20,
        })

        return () => tween.revert()
      })

      select<HTMLElement>('[data-about-lines]').forEach((element) => {
        let tween: gsap.core.Tween | null = null
        let revealed = false
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
              ease: 'about-unmask',
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

      select<HTMLElement>('[data-about-fade]').forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            start: 'top 85%',
            trigger: element,
          },
          y: () => getDesignUnit(page) * 3,
        })
      })

      select<HTMLElement>('[data-about-arrow]').forEach((element) => {
        const arrows = Array.from(element.querySelectorAll('svg'))
        gsap.fromTo(
          arrows,
          { xPercent: (index) => (index === 0 ? -150 : 0) },
          {
            delay: 0.5,
            duration: 1,
            ease: 'about-snappy',
            scrollTrigger: {
              start: 'top 85%',
              trigger: element,
            },
            stagger: -0.25,
            xPercent: (index) => (index === 0 ? 0 : 100),
          },
        )
      })

      const clientCharacters = select('[data-about-client-character]')
      if (clientCharacters.length) {
        gsap.from(clientCharacters, {
          duration: 1,
          ease: 'about-unmask',
          scrollTrigger: {
            once: true,
            start: 'top 85%',
            trigger: select('[data-about-clients-title]')[0],
          },
          stagger: 0.1,
          yPercent: 100,
        })
      }

      const clientMarks = select('[data-about-client-grid] li > span')
      const clientTriggers = ScrollTrigger.batch(clientMarks, {
        batchMax: 4,
        interval: 0.1,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            duration: 0.7,
            ease: 'expo.out',
            overwrite: true,
            stagger: 0.1,
            yPercent: 0,
          })
        },
        start: 'top 85%',
      })
      gsap.set(clientMarks, { autoAlpha: 0, yPercent: 25 })

      let refreshFrame: number | null = null
      const requestRefresh = () => {
        if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = null
          ScrollTrigger.refresh()
        })
      }
      const observer = new ResizeObserver(requestRefresh)
      observer.observe(page)
      let cancelled = false
      void document.fonts.ready.then(() => {
        if (!cancelled) requestRefresh()
      })

      return () => {
        cancelled = true
        if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
        observer.disconnect()
        clientTriggers.forEach((trigger) => trigger.kill())
        splitTweens.forEach((tween) => tween.kill())
        splits.forEach((split) => split.revert())
        desktopShift.revert()
      }
    })

    motion.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(page, { clearProps: 'transform' })
    })

    return () => motion.revert()
  }, [])

  return null
}
