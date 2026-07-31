import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { LowImpactHero } from '@/heros/LowImpact'

import { AboutShowcase } from './AboutShowcase.client'
import styles from './about.module.css'

const studioPrinciples = [
  {
    body: 'Strategy, design, motion, and development work together from the first question to the final release.',
    title: 'One connected studio',
  },
  {
    body: 'Small senior teams stay close to the work, move quickly, and solve the parts that matter most.',
    title: 'High-impact teams',
  },
  {
    body: 'Johannesburg roots meet a distributed network built for focused collaboration across regions and time zones.',
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
    <div className={`route-shell ${styles.page}`} data-route-shell>
      <LowImpactHero>
        <div className="payload-richtext mx-auto prose md:prose-md dark:prose-invert max-w-none">
          <h1 className="mb-[0.25em]">About</h1>
        </div>
      </LowImpactHero>

      <section className={styles.opening}>
        <div className={styles.displayTitle}>
          <span>DIGITAL FOR</span>
          <span>AMBITIOUS</span>
          <span>
            BRANDS.
            <Image alt="" aria-hidden="true" height={88} src="/favicon.svg" unoptimized width={88} />
          </span>
        </div>
        <div className={styles.openingMeta}>
          <p>An independent digital studio partnering with ambitious teams.</p>
          <span>(About us)</span>
        </div>
      </section>

      <AboutShowcase images={showcaseImages} />

      <section className={styles.intro}>
        <ArrowRight aria-hidden="true" />
        <h2>Dedicated and seamlessly integrated, a true extension of brands.</h2>
        <div className={styles.introCopy}>
          <p>
            VRTKS is an independent digital studio based in Johannesburg, partnering with teams
            globally.
          </p>
          <p>
            We specialise in brand systems, websites, digital products, and motion. Research and
            clear thinking shape every decision before design turns it into something useful,
            memorable, and built to last.
          </p>
          <p>
            Small teams stay close to every project. Strategy and making happen together, without
            layers between idea and execution.
          </p>
        </div>
      </section>

      <section className={styles.manifesto}>
        <div className={styles.sectionLabels}>
          <span>(Our focus)</span>
          <span>Building brands that move, scale, and stay useful.</span>
          <span>Let&apos;s work together</span>
        </div>
        <h2>
          WE GO BEYOND
          <br />
          WEBSITES. WE BUILD
          <br />
          BRAND SYSTEMS.
        </h2>
      </section>

      <section className={styles.principles}>
        <div className={styles.principlesImage}>
          <Image
            alt="Layered blue and coral shapes representing a connected brand system"
            fill
            sizes="(max-width: 48rem) 100vw, 46vw"
            src="/api/media/file/mock-why-strategic-design-outlives-trends.webp"
          />
        </div>
        <div className={styles.principlesCopy}>
          <h2>Life @ VRTKS</h2>
          <ol>
            {studioPrinciples.map((principle, index) => (
              <li key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}.</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.statement}>
        <ArrowRight aria-hidden="true" />
        <p>Partners in strategy, identities, digital systems, and products.</p>
      </section>

      <section className={styles.clients}>
        <div className={styles.clientsHeading}>
          <h2>CLIENTS</h2>
          <span>(Selected partners)</span>
        </div>
        <ul>
          {partners.map((partner) => (
            <li key={partner}>{partner}</li>
          ))}
        </ul>
      </section>

      <section className={styles.closing}>
        <div className={styles.closingImage}>
          <Image
            alt="Colorful interface panels layered into a digital brand ecosystem"
            fill
            sizes="(max-width: 48rem) 100vw, 50vw"
            src="/api/media/file/mock-how-motion-makes-digital-experiences-memorable.webp"
          />
        </div>
        <div className={styles.closingCopy}>
          <h2>From strategy and identity to complete digital ecosystems.</h2>
          <a href="mailto:info@vorteksdigital.co.za">Start a conversation</a>
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
