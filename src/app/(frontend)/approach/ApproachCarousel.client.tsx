'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import styles from './approach.module.css'

const principles = [
  {
    body: 'We clarify goals, users, constraints, scope and priorities before recommending the work.',
    title: 'Understand the need',
  },
  {
    body: 'The right mix of strategy, design and development moves from plan to working solution.',
    title: 'Shape and build',
  },
  {
    body: 'Launch is followed by practical handover, maintenance or ongoing support when required.',
    title: 'Support what follows',
  },
]

export function ApproachCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = principles[activeIndex]
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + principles.length) % principles.length)
  }

  return (
    <div className={styles.carousel} data-route-fade>
      <article aria-live="polite" className={styles.carouselCard}>
        <span>VRTKS</span>
        <h3>{active.title}</h3>
        <p>{active.body}</p>
      </article>
      <div className={styles.carouselControls}>
        <span>
          {String(activeIndex + 1).padStart(2, '0')} — {String(principles.length).padStart(2, '0')}
        </span>
        <div>
          <button aria-label="Previous principle" onClick={() => move(-1)} type="button">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button aria-label="Next principle" onClick={() => move(1)} type="button">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
