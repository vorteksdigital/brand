import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AboutAnimations } from './AboutAnimations.client'
import { AboutShowcase } from './AboutShowcase.client'
import styles from './about.module.css'

const principles = [
  {
    body: 'We think holistically, considering strategy, digital, cross-functional teams, and outcomes from day one. We foster open dialogue, thoughtful questions, and diverse perspectives.',
    title: 'A holistic studio',
  },
  {
    body: 'We work alongside experienced talent to build digital systems at scale. If you’re interested in thoughtful, system-led work inside complex brand environments, we’d love to hear from you.',
    title: 'High-impact teams',
  },
  {
    body: 'Johannesburg roots meet a distributed network built for consistent collaboration across regions and time zones.',
    title: 'A flexible model',
  },
]

const partners = [
  'Aperture',
  'Northstar',
  'Common Ground',
  'Metric',
  'Fieldwork',
  'Loop',
  'Studio One',
  'Assembly',
  'Morrow',
  'Current',
  'Parallel',
  'Good Company',
  'Daylight',
  'Kin',
  'Outline',
  'Soft Focus',
]

const showcaseImages = [
  {
    alt: 'Man reflected beside a Mandela portrait inside a Houghton café',
    src: '/images/johannesburg/houghton-cafe-portrait.webp',
  },
  {
    alt: 'Young woman standing in front of a colourful Johannesburg mural',
    src: '/images/johannesburg/johannesburg-mural-portrait.webp',
  },
  {
    alt: 'Dense rooftops and colourful murals across Johannesburg city centre',
    src: '/images/johannesburg/johannesburg-city-centre.webp',
  },
  {
    alt: 'Empty outdoor café tables on a Johannesburg street',
    src: '/images/johannesburg/johannesburg-street-cafe.webp',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page} data-about-page>
      <AboutAnimations />
      <section className={styles.hero}>
        <div className={styles.heroTitleWrap}>
          <div className={styles.heroMedia} aria-hidden="true" data-about-hero-media>
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 48rem) 44vw, 18vw"
              src="/images/johannesburg/houghton-cafe-portrait.webp"
            />
          </div>
          <h1 aria-label="Digital for global brands.">
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                <span className={styles.heroTitleShift} data-about-hero-shift>
                  Digital
                </span>
              </span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                for global
              </span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                brands.
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.heroFooter}>
          <p data-about-subtitle>
            An independent digital partner, collaborating with ambitious teams.
          </p>
          <span aria-hidden="true">(Scroll)</span>
        </div>
      </section>

      <AboutShowcase images={showcaseImages} />

      <section className={`${styles.company} content-section`}>
        <div className={styles.companyCue}>
          <span className={styles.arrowCue} data-about-arrow>
            <ArrowRight aria-hidden="true" />
            <ArrowRight aria-hidden="true" />
          </span>
          <span>(Company)</span>
        </div>
        <div className={styles.companyContent}>
          <h2 data-about-lines>Dedicated and seamlessly integrated, a true extension of brands.</h2>
          <div className={styles.companyDetails}>
            <span data-about-fade>(Company)</span>
            <div data-about-fade>
              <p>
                <strong>
                  VRTKS is an independent digital studio based in Johannesburg, partnering with
                  teams globally.
                </strong>
              </p>
              <p>
                We specialise in brand systems, websites, digital products, and motion—building
                connected experiences that give brands clarity and a consistent way to show up.
              </p>
              <p>
                Good systems come from close partnerships. We integrate deeply, collaborate openly,
                and solve alongside the people who know the business best.
              </p>
              <p>
                That trust lets the work evolve as the brand grows, across new products, channels,
                and moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.focus} content-section`}>
        <span>(Our focus)</span>
        <p>Defining how brands move, scale, and express themselves.</p>
        <Link href="/contact">Let&apos;s work together</Link>
      </section>

      <section className={`${styles.life} content-section`}>
        <div className={styles.lifeMedia}>
          <Image
            alt="Young woman standing in front of a colourful Johannesburg mural"
            fill
            sizes="(max-width: 48rem) 100vw, 42vw"
            src="/images/johannesburg/johannesburg-mural-portrait.webp"
          />
        </div>
        <div className={styles.lifeContent}>
          <h2 data-about-lines>Life @ VRTKS</h2>
          <ol>
            {principles.map((principle, index) => (
              <li key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}.</span>
                <div data-about-fade>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.statement} content-section`}>
        <span className={styles.arrowCue} data-about-arrow>
          <ArrowRight aria-hidden="true" />
          <ArrowRight aria-hidden="true" />
        </span>
        <h2 data-about-lines>Leaders in brand systems, identities, products &amp; motion.</h2>
      </section>

      <section className={`${styles.clients} content-section`}>
        <div className={styles.clientsHeading}>
          <h2 aria-label="Clients" data-about-clients-title>
            <span aria-hidden="true">
              {'Clients'.split('').map((character, index) => (
                <span className={styles.clientCharacter} key={`${character}-${index}`}>
                  <span data-about-client-character>{character}</span>
                </span>
              ))}
            </span>
          </h2>
          <span>(Our partners)</span>
        </div>
        <ul data-about-client-grid>
          {partners.map((partner) => (
            <li key={partner}>
              <span>{partner}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.services} content-section`}>
        <div className={styles.servicesMedia}>
          <Image
            alt="Glass-fronted modern buildings framed by trees in Melrose Arch"
            fill
            sizes="(max-width: 48rem) 100vw, 50vw"
            src="/images/johannesburg/melrose-arch-modern-building.webp"
          />
        </div>
        <div className={styles.servicesContent}>
          <h2 data-about-lines>From strategy &amp; identity to entire digital ecosystems.</h2>
          <div data-about-fade>
            <Link href="/approach">Learn more about our approach</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: '/about',
    },
    description: 'Meet VRTKS Digital, an independent digital studio in Johannesburg.',
    title: 'About | VRTKS Digital',
  }
}
