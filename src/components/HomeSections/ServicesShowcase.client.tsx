'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

import styles from './index.module.css'

const services = [
  {
    alt: 'Young woman standing in front of a colourful Johannesburg mural',
    description:
      'We create digital identities that are distinct, memorable, and built to move across every touchpoint.',
    image: '/images/johannesburg/johannesburg-mural-portrait.webp',
    name: 'Identities',
  },
  {
    alt: 'Glass-fronted modern buildings framed by trees in Melrose Arch',
    description:
      'We design flexible systems that bring clarity and consistency to products, platforms, and teams.',
    image: '/images/johannesburg/melrose-arch-modern-building.webp',
    name: 'Systems',
  },
  {
    alt: 'Traffic, buses, and pedestrians moving through central Johannesburg',
    description:
      'We turn brand decisions into practical guidelines that help teams create with confidence.',
    image: '/images/johannesburg/joburg-cbd-traffic.webp',
    name: 'Guidelines',
  },
] as const

type ShowcaseStyle = CSSProperties & {
  '--service-offset': string
}

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const featureRef = useRef<HTMLDivElement>(null)
  const serviceListRef = useRef<HTMLDivElement>(null)
  const activeService = services[activeIndex]
  const showcaseStyle: ShowcaseStyle = {
    '--service-offset': `${offset}px`,
  }

  useLayoutEffect(() => {
    let cancelled = false
    const updateOffsets = () => {
      const listOffset = serviceListRef.current?.offsetTop ?? 0
      const featureHeight = featureRef.current?.offsetHeight ?? 0
      const alignmentOffset = (button: HTMLButtonElement | null | undefined, index: number) => {
        if (!button) return 0

        const top = button.offsetTop - listOffset
        if (index === 0) return top
        if (index === services.length - 1) return top + button.offsetHeight - featureHeight

        return top + (button.offsetHeight - featureHeight) / 2
      }
      const active = alignmentOffset(buttonRefs.current[activeIndex], activeIndex)
      setOffset((current) => (current === active ? current : active))
    }

    updateOffsets()
    const observer = new ResizeObserver(updateOffsets)
    if (serviceListRef.current) observer.observe(serviceListRef.current)
    if (featureRef.current) observer.observe(featureRef.current)
    window.addEventListener('resize', updateOffsets)
    void document.fonts.ready.then(() => {
      if (!cancelled) updateOffsets()
    })

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener('resize', updateOffsets)
    }
  }, [activeIndex])

  return (
    <div className={styles.servicesShowcase} data-home-services-showcase style={showcaseStyle}>
      <div className={styles.serviceFeature} data-home-service-feature ref={featureRef}>
        <div className={styles.serviceMedia} data-home-service-media>
          {services.map((service, index) => (
            <Image
              alt={service.alt}
              aria-hidden={index !== activeIndex}
              className={index === activeIndex ? styles.serviceImageActive : styles.serviceImage}
              fill
              key={service.name}
              sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 29vw"
              src={service.image}
            />
          ))}
        </div>
        <p aria-live="polite">{activeService.description}</p>
      </div>

      <div aria-label="Services" className={styles.serviceList} ref={serviceListRef}>
        {services.map((service, index) => (
          <button
            aria-pressed={index === activeIndex}
            className={index === activeIndex ? styles.serviceButtonActive : styles.serviceButton}
            key={service.name}
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onPointerEnter={() => setActiveIndex(index)}
            ref={(button) => {
              buttonRefs.current[index] = button
            }}
            type="button"
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  )
}
