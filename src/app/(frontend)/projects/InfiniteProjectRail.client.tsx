'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { Children, type ReactNode, useRef, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, FreeMode, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import styles from './projects.module.css'

gsap.registerPlugin(Observer, useGSAP)

const SLIDE_DURATION = 650
const WHEEL_SENSITIVITY = 2.5

type Props = {
  children: ReactNode
}

export function InfiniteProjectRail({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const slides = Children.toArray(children)

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      const page = root?.closest<HTMLElement>('[data-projects-page]')

      if (!contextSafe || !page || !root || !swiper) return

      let reducedMotion = false
      let wheelTarget = 0
      let previousWheelPosition = 0
      const wheelProgress = { position: 0 }
      const updateActiveIndex = () => {
        root.dataset.projectActiveIndex = String(swiper.realIndex)
      }
      const applyWheelPosition = contextSafe(() => {
        const distance = wheelProgress.position - previousWheelPosition
        previousWheelPosition = wheelProgress.position
        root.dataset.projectWheelDistance = String(Math.round(wheelProgress.position))

        if (!distance || swiper.destroyed) return

        const nextTranslate = gsap.utils.clamp(
          swiper.maxTranslate(),
          swiper.minTranslate(),
          swiper.getTranslate() - distance,
        )

        swiper.setTransition(0)
        swiper.setTranslate(nextTranslate)
        swiper.updateProgress()
        swiper.updateActiveIndex()
        swiper.updateSlidesClasses()

        if (swiper.params.loop) {
          swiper.loopFix({
            byMousewheel: true,
            direction: distance > 0 ? 'next' : 'prev',
            setTranslate: true,
          })
        }

        updateActiveIndex()
      })
      const moveWheel = contextSafe((observer: Observer) => {
        const delta =
          Math.abs(observer.deltaY) >= Math.abs(observer.deltaX) ? observer.deltaY : observer.deltaX

        wheelTarget += delta * WHEEL_SENSITIVITY

        if (reducedMotion) {
          wheelProgress.position = wheelTarget
          applyWheelPosition()
          return
        }

        gsap.to(wheelProgress, {
          duration: 0.45,
          ease: 'power3.out',
          onUpdate: applyWheelPosition,
          overwrite: true,
          position: wheelTarget,
        })
      })
      const wheelObserver = Observer.create({
        allowClicks: true,
        ignoreCheck: (event) => event instanceof WheelEvent && event.ctrlKey,
        lockAxis: true,
        onChange: moveWheel,
        preventDefault: true,
        target: page,
        tolerance: 1,
        type: 'wheel',
      })
      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        reducedMotion = false
        swiper.params.speed = SLIDE_DURATION
        if (typeof swiper.params.freeMode === 'object') {
          swiper.params.freeMode.momentum = true
        }

        const cards = Array.from(root.querySelectorAll<HTMLElement>('article'))
        const enterCard = contextSafe((event: PointerEvent) => {
          if (event.pointerType === 'touch') return

          const card = event.currentTarget
          if (!(card instanceof HTMLElement)) return

          const image = card.querySelector<HTMLElement>('img')
          if (image) {
            gsap.to(image, {
              duration: 0.5,
              ease: 'power3.out',
              overwrite: true,
              scale: 1.025,
            })
          }
        })
        const leaveCard = contextSafe((event: PointerEvent) => {
          const card = event.currentTarget
          if (!(card instanceof HTMLElement)) return

          const image = card.querySelector<HTMLElement>('img')
          if (image) {
            gsap.to(image, {
              clearProps: 'transform',
              duration: 0.5,
              ease: 'power3.out',
              overwrite: true,
              scale: 1,
            })
          }
        })

        cards.forEach((card) => {
          card.addEventListener('pointerenter', enterCard)
          card.addEventListener('pointerleave', leaveCard)
        })

        return () => {
          cards.forEach((card) => {
            card.removeEventListener('pointerenter', enterCard)
            card.removeEventListener('pointerleave', leaveCard)
          })
        }
      })

      motion.add('(prefers-reduced-motion: reduce)', () => {
        reducedMotion = true
        swiper.params.speed = 0
        if (typeof swiper.params.freeMode === 'object') {
          swiper.params.freeMode.momentum = false
        }
        gsap.set(root.querySelectorAll('article, article img'), { clearProps: 'all' })
      })

      swiper.on('activeIndexChange', updateActiveIndex)
      updateActiveIndex()

      return () => {
        wheelObserver.kill()
        gsap.killTweensOf(wheelProgress)
        motion.revert()
        swiper.off('activeIndexChange', updateActiveIndex)
      }
    },
    { dependencies: [swiper], revertOnUpdate: true, scope: rootRef },
  )

  return (
    <div
      aria-label="Scrollable project gallery"
      className={styles.scroller}
      data-project-active-index="0"
      data-project-wheel-distance="0"
      data-project-scroller
      ref={rootRef}
      role="region"
      tabIndex={0}
    >
      <Swiper
        a11y={{
          containerRole: 'group',
          containerRoleDescriptionMessage: 'carousel',
          itemRoleDescriptionMessage: 'slide',
          slideLabelMessage: '{{index}} of {{slidesLength}}',
        }}
        className={styles.swiper}
        freeMode={{
          enabled: true,
          momentum: true,
          momentumBounce: false,
          momentumRatio: 0.75,
          momentumVelocityRatio: 0.75,
          sticky: false,
        }}
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
        loop={slides.length > 1}
        loopAdditionalSlides={1}
        modules={[A11y, FreeMode, Keyboard]}
        onSwiper={setSwiper}
        slidesPerView="auto"
        spaceBetween={16}
        speed={SLIDE_DURATION}
        watchSlidesProgress
        breakpoints={{
          768: {
            spaceBetween: 20,
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide className={styles.slide} key={index}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
