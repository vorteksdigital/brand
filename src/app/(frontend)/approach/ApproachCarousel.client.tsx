'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

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
  const [reducedMotion, setReducedMotion] = useState(false)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches)

    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)

    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  const move = (direction: -1 | 1) => {
    if (!swiper) return
    if (direction === -1) swiper.slidePrev()
    else swiper.slideNext()
  }

  return (
    <div
      aria-label="Working principles"
      className={styles.carousel}
      data-approach-carousel
      data-route-fade
      role="region"
    >
      <Swiper
        a11y={{
          containerRole: 'group',
          containerRoleDescriptionMessage: 'carousel',
          itemRoleDescriptionMessage: 'slide',
          slideLabelMessage: '{{index}} of {{slidesLength}}',
        }}
        className={styles.carouselSwiper}
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        loop
        modules={[A11y, Keyboard]}
        onRealIndexChange={(instance) => setActiveIndex(instance.realIndex)}
        onSwiper={setSwiper}
        slidesPerView={1}
        speed={reducedMotion ? 0 : 700}
      >
        {principles.map((principle) => (
          <SwiperSlide className={styles.carouselSlide} key={principle.title}>
            <article className={styles.carouselCard} data-approach-carousel-slide>
              <Image
                alt=""
                className={styles.carouselLogo}
                height={65}
                src="/logo-vrtks.svg"
                unoptimized
                width={500}
              />
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
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
