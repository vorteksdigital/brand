'use client'

import type { ReactNode, WheelEvent } from 'react'

import { useCallback, useEffect, useRef } from 'react'

import styles from './projects.module.css'

type Props = {
  children: ReactNode
}

export function InfiniteProjectRail({ children }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const wrappingRef = useRef(false)

  const readCycleWidth = useCallback(() => {
    const rail = railRef.current
    const firstCycle = rail?.querySelector<HTMLElement>('[data-project-cycle]')

    if (!rail || !firstCycle) return 0

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0
    return firstCycle.getBoundingClientRect().width + gap
  }, [])

  const centerRail = useCallback(() => {
    const rail = railRef.current
    const cycleWidth = readCycleWidth()

    if (rail && cycleWidth) rail.scrollLeft = cycleWidth
  }, [readCycleWidth])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    centerRail()
    const observer = new ResizeObserver(centerRail)
    observer.observe(rail)

    return () => observer.disconnect()
  }, [centerRail])

  const handleScroll = () => {
    const rail = railRef.current
    const cycleWidth = readCycleWidth()

    if (!rail || !cycleWidth || wrappingRef.current) return

    if (rail.scrollLeft < cycleWidth * 0.5) {
      wrappingRef.current = true
      rail.scrollLeft += cycleWidth
    } else if (rail.scrollLeft >= cycleWidth * 1.5) {
      wrappingRef.current = true
      rail.scrollLeft -= cycleWidth
    }

    if (wrappingRef.current) requestAnimationFrame(() => (wrappingRef.current = false))
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    event.currentTarget.scrollLeft += event.deltaY
  }

  return (
    <div
      aria-label="Scrollable project gallery"
      className={styles.scroller}
      data-project-scroller
      onScroll={handleScroll}
      onWheel={handleWheel}
      ref={railRef}
      role="region"
      tabIndex={0}
    >
      {[0, 1, 2].map((cycle) => (
        <div
          aria-hidden={cycle === 1 ? undefined : true}
          className={styles.cycle}
          data-project-cycle
          inert={cycle === 1 ? undefined : true}
          key={cycle}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
