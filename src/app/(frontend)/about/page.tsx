import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AboutAnimations } from './AboutAnimations.client'
import { AboutShowcase } from './AboutShowcase.client'
import styles from './about.module.css'

const principles = [
  {
    body: 'You work directly with a flexible studio team, without unnecessary account layers or a drawn-out agency process.',
    title: 'Less overhead',
  },
  {
    body: 'Strategy, design, development and ongoing support stay connected, so useful context does not disappear between suppliers.',
    title: 'Joined-up delivery',
  },
  {
    body: 'Based in Johannesburg and working worldwide, Vorteks Digital can support a defined project or become a long-term digital partner.',
    title: 'Built to flex',
  },
]

const capabilities = [
  'Website strategy',
  'Web design',
  'Web development',
  'WordPress',
  'Website maintenance',
  'Digital products',
  'Bespoke solutions',
  'Brand strategy',
  'Brand identity',
  'Brand systems',
  'Motion design',
  'SEO support',
  'Marketing support',
  'Graphic design',
  'Content design',
  'Technical support',
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
          <h1 aria-label="Digital support for growing businesses.">
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                <span className={styles.heroTitleShift} data-about-hero-shift>
                  Digital support
                </span>
              </span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                for growing
              </span>
            </span>
            <span aria-hidden="true" className={styles.heroTitleLine}>
              <span className={styles.heroTitleRise} data-about-hero-line>
                businesses.
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.heroFooter}>
          <h2 data-about-subtitle>
            High-quality work, direct collaboration and less agency overhead.
          </h2>
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
          <h2 data-about-lines>A flexible digital studio for startups and growing businesses.</h2>
          <div className={styles.companyDetails}>
            <span data-about-fade>(Company)</span>
            <div data-about-fade>
              <p>
                <strong>
                  Vorteks Digital is an independent digital studio established in 2020 and based
                  in Johannesburg, serving clients worldwide.
                </strong>
              </p>
              <p>
                Our commercial focus is websites, digital products and bespoke digital solutions.
                We also support WordPress, maintenance, branding, motion, marketing, SEO and
                graphic design.
              </p>
              <p>
                The model is deliberately lean. Clients get high-quality thinking and delivery
                without the overhead, hand-offs and complexity of a traditional large agency.
              </p>
              <p>
                Engagements can begin with one defined need or grow into ongoing digital support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.focus} content-section`}>
        <span>(Our focus)</span>
        <p>Building useful digital foundations without unnecessary complexity.</p>
        <Link href="/contact">Start a project</Link>
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
          <h2 data-about-lines>How we work</h2>
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
        <h2 data-about-lines>Quality work without a traditional agency structure.</h2>
      </section>

      <section className={`${styles.clients} content-section`}>
        <div className={styles.clientsHeading}>
          <h2 aria-label="Capabilities" data-about-clients-title>
            <span aria-hidden="true">
              {'Capabilities'.split('').map((character, index) => (
                <span className={styles.clientCharacter} key={`${character}-${index}`}>
                  <span data-about-client-character>{character}</span>
                </span>
              ))}
            </span>
          </h2>
          <span>(Services)</span>
        </div>
        <ul data-about-client-grid>
          {capabilities.map((capability) => (
            <li key={capability}>
              <span>{capability}</span>
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
          <h2 data-about-lines>Need a website, product or solution that fits your business?</h2>
          <div data-about-fade>
            <Link href="/contact">Tell us what you need</Link>
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
    description:
      'Meet Vorteks Digital, a global digital studio helping startups build websites, products and bespoke solutions without big-agency overhead.',
    title: 'About Vorteks Digital | Global Digital Studio',
  }
}
