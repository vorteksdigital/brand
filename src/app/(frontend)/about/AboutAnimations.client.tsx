'use client'

import { useEffect } from 'react'

export function AboutAnimations() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('[data-about-page]')
    if (!page) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let refreshTimer = 0
    let enterFrame = requestAnimationFrame(() => {
      enterFrame = requestAnimationFrame(() => {
        page.dataset.aboutEntered = 'true'
        refreshTimer = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 1300)
      })
    })

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-about-reveal]'))
    if (reducedMotion.matches) {
      revealItems.forEach((item) => {
        item.dataset.aboutVisible = 'true'
      })
      page.dataset.aboutEntered = 'true'
      return () => {
        cancelAnimationFrame(enterFrame)
        window.clearTimeout(refreshTimer)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          target.dataset.aboutVisible = 'true'
          observer.unobserve(target)
        })
      },
      { rootMargin: '0px 0px -15% 0px' },
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => {
      cancelAnimationFrame(enterFrame)
      window.clearTimeout(refreshTimer)
      observer.disconnect()
    }
  }, [])

  return null
}
