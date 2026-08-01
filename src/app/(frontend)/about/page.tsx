import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AboutAnimations } from './AboutAnimations.client'
import { AboutShowcase } from './AboutShowcase.client'
import styles from './about.module.css'

const principles = [
  {
    body: 'Strategy, identity, digital, and motion are considered together from day one. Open dialogue and different perspectives keep the work sharp.',
    title: 'A holistic studio',
  },
  {
    body: 'Small senior teams stay close to the work, move with purpose, and build the systems ambitious brands need to grow.',
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
    alt: 'Abstract violet and orange shapes moving across a dark field',
    src: '/api/media/file/mock-building-brands-that-move-at-digital-speed.webp',
  },
  {
    alt: 'Interlocking green and indigo forms forming a clear path',
    src: '/api/media/file/mock-turning-complex-products-into-clear-stories.webp',
  },
  {
    alt: 'Warm gold and blue shapes arranged around an abstract core',
    src: '/api/media/file/mock-designing-for-trust-in-an-ai-first-world.webp',
  },
  {
    alt: 'Magenta and lime fragments creating a bold composition',
    src: '/api/media/file/mock-from-brand-audit-to-bold-new-direction.webp',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page} data-about-page>
      <AboutAnimations />
      <section className={styles.hero}>
        <div className={styles.heroTitleWrap}>
          <div className={styles.heroMedia} aria-hidden="true">
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 48rem) 44vw, 18vw"
              src="/api/media/file/mock-how-motion-makes-digital-experiences-memorable.webp"
            />
          </div>
          <h1 aria-label="Digital for global brands.">
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise}>
                <span className={styles.heroTitleShift}>Digital</span>
              </span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise}>for global</span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise}>brands.</span>
            </span>
          </h1>
        </div>

        <div className={styles.heroFooter}>
          <p>
            <span>An independent digital studio, collaborating with</span>
            <span>ambitious teams.</span>
          </p>
          <span aria-hidden="true">(Scroll)</span>
        </div>
      </section>

      <AboutShowcase images={showcaseImages} />

      <section className={styles.company}>
        <div className={styles.companyCue}>
          <span className={styles.arrowCue} data-about-reveal>
            <ArrowRight aria-hidden="true" />
            <ArrowRight aria-hidden="true" />
          </span>
          <span>(Company)</span>
        </div>
        <div className={styles.companyContent}>
          <div className={styles.revealMask} data-about-reveal>
            <h2>Dedicated and seamlessly integrated, a true extension of brands.</h2>
          </div>
          <div className={styles.companyDetails}>
            <span className={styles.fadeUp} data-about-reveal>
              (Company)
            </span>
            <div className={styles.fadeUp} data-about-reveal>
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
                Good systems come from close partnerships. We integrate deeply, collaborate
                openly, and solve alongside the people who know the business best.
              </p>
              <p>
                That trust lets the work evolve as the brand grows, across new products, channels,
                and moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.focus}>
        <span>(Our focus)</span>
        <p>Defining how brands move, scale, and express themselves.</p>
        <Link href="/contact">Let&apos;s work together</Link>
      </section>

      <section className={styles.usp} data-about-reveal>
        <h2 className={styles.uspTitle}>
          <span className={`${styles.uspMedia} ${styles.uspMobileMedia}`}>
            <Image
              alt=""
              aria-hidden="true"
              fill
              sizes="82vw"
              src="/api/media/file/mock-building-brands-that-move-at-digital-speed.webp"
            />
          </span>
          <span className={styles.uspLine}>
            <span>We go beyond</span>
          </span>
          <span className={`${styles.uspLine} ${styles.uspLineWithMedia}`}>
            <span className={styles.uspMedia}>
              <Image
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 48rem) 82vw, 18vw"
                src="/api/media/file/mock-building-brands-that-move-at-digital-speed.webp"
              />
            </span>
            <span>websites.</span>
          </span>
          <span className={styles.uspLine}>
            <span>We transform</span>
          </span>
          <span className={`${styles.uspLine} ${styles.uspLineWithMedia}`}>
            <span>brands.</span>
            <span className={`${styles.uspMedia} ${styles.uspMediaSecond}`}>
              <Image
                alt=""
                aria-hidden="true"
                fill
                sizes="18vw"
                src="/api/media/file/mock-designing-for-trust-in-an-ai-first-world.webp"
              />
            </span>
          </span>
        </h2>
      </section>

      <section className={styles.life}>
        <div className={styles.lifeMedia}>
          <Image
            alt="Layered blue and coral forms representing a connected brand system"
            fill
            sizes="(max-width: 48rem) 100vw, 42vw"
            src="/api/media/file/mock-why-strategic-design-outlives-trends.webp"
          />
        </div>
        <div className={styles.lifeContent}>
          <div className={styles.revealMask} data-about-reveal>
            <h2>Life @ VRTKS</h2>
          </div>
          <ol>
            {principles.map((principle, index) => (
              <li key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}.</span>
                <div className={styles.fadeUp} data-about-reveal>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.statement}>
        <span className={styles.arrowCue} data-about-reveal>
          <ArrowRight aria-hidden="true" />
          <ArrowRight aria-hidden="true" />
        </span>
        <div className={styles.revealMask} data-about-reveal>
          <h2>Leaders in brand systems, identities, digital products &amp; motion.</h2>
        </div>
      </section>

      <section className={styles.clients} data-about-reveal>
        <div className={styles.clientsHeading}>
          <h2 aria-label="Clients">
            <span aria-hidden="true">
              {'Clients'.split('').map((character, index) => (
                <span className={styles.clientCharacter} key={`${character}-${index}`}>
                  <span style={{ transitionDelay: `${index * 100}ms` }}>{character}</span>
                </span>
              ))}
            </span>
          </h2>
          <span>(Our partners)</span>
        </div>
        <ul data-about-reveal>
          {partners.map((partner, index) => (
            <li key={partner}>
              <span style={{ transitionDelay: `${(index % 4) * 100}ms` }}>{partner}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.services}>
        <div className={styles.servicesMedia}>
          <Image
            alt="Colourful interface panels layered into a digital brand ecosystem"
            fill
            sizes="(max-width: 48rem) 100vw, 50vw"
            src="/api/media/file/mock-how-motion-makes-digital-experiences-memorable.webp"
          />
        </div>
        <div className={styles.servicesContent}>
          <div className={styles.revealMask} data-about-reveal>
            <h2>From strategy &amp; identity to entire digital ecosystems.</h2>
          </div>
          <div className={styles.fadeUp} data-about-reveal>
            <Link href="/contact">Learn more about our approach</Link>
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
