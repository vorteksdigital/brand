'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'

const SCROLL_DURATION_MS = 1100

const easeInOutCubic = (progress: number): number =>
  progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2

type Props = {
  children: ReactNode
  className?: string
  targetId: string
}

export function SmoothScrollLink({ children, className, targetId }: Props) {
  const animationFrameRef = useRef<null | number>(null)

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current === null) return

    window.cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', cancelAnimation)
    window.addEventListener('touchstart', cancelAnimation, { passive: true })
    window.addEventListener('wheel', cancelAnimation, { passive: true })

    return () => {
      cancelAnimation()
      window.removeEventListener('keydown', cancelAnimation)
      window.removeEventListener('touchstart', cancelAnimation)
      window.removeEventListener('wheel', cancelAnimation)
    }
  }, [cancelAnimation])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = document.getElementById(targetId)

    if (!target) return

    event.preventDefault()
    cancelAnimation()

    const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    const maximumScroll = document.documentElement.scrollHeight - window.innerHeight
    const targetScroll = Math.min(
      maximumScroll,
      Math.max(0, window.scrollY + target.getBoundingClientRect().top - scrollMarginTop),
    )

    if (window.location.hash !== `#${targetId}`) {
      window.history.pushState(null, '', `#${targetId}`)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ behavior: 'auto', top: targetScroll })
      return
    }

    const initialScroll = window.scrollY
    const distance = targetScroll - initialScroll
    const startTime = window.performance.now()

    const scrollFrame = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startTime) / SCROLL_DURATION_MS)

      window.scrollTo({ top: initialScroll + distance * easeInOutCubic(progress) })

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(scrollFrame)
      } else {
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(scrollFrame)
  }

  return (
    <a className={className} href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  )
}
