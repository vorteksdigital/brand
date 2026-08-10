import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { HeroImageReveal } from '@/components/ReferencePages/HeroImageReveal.client'
import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'

import { ApproachCarousel } from './ApproachCarousel.client'
import styles from './approach.module.css'

const principles = [
  {
    body: 'We clarify the business need, audience, scope and useful measure of success before choosing the solution.',
    title: 'Start with the problem',
  },
  {
    body: 'Strategy, design and development stay connected, reducing hand-offs and keeping decisions grounded in delivery.',
    title: 'Keep delivery joined up',
  },
  {
    body: 'Clear communication, practical documentation and ongoing support help your team use and extend what we build.',
    title: 'Make it useful after launch',
  },
]

export default function ApproachPage() {
  return (
    <div className={styles.page} data-approach-page data-reference-route>
      <HeroImageReveal />
      <RouteAnimations />

      <section className={styles.hero}>
        <div className={styles.heroTitleWrap} data-hero-title-wrap>
          <div aria-hidden="true" className={styles.heroMedia} data-hero-image-reveal>
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 48rem) 44vw, 18vw"
              src="/images/johannesburg/johannesburg-mural-portrait.webp"
            />
          </div>
          <h1 aria-label="Digital support, built around your business.">
            <span aria-hidden="true">
              <span className={styles.heroTitleShift} data-hero-image-shift>
                <span data-route-hero-line>Digital support,</span>
              </span>
            </span>
            <span aria-hidden="true">
              <span data-route-hero-line>built around you.</span>
            </span>
          </h1>
        </div>
        <div className={styles.heroFooter}>
          <h2 data-route-hero-copy>
            Websites, digital products and bespoke solutions for startups worldwide.
          </h2>
          <span data-route-hero-copy>(Scroll)</span>
        </div>
      </section>

      <section className={`${styles.intro} content-section`}>
        <div className={styles.cue} aria-hidden="true">
          <ArrowRight />
        </div>
        <div className={styles.introContent}>
          <h2 data-route-lines>Choose the support you need, without buying an agency machine.</h2>
          <div className={styles.introDetails}>
            <span data-route-fade>(Approach)</span>
            <div data-route-fade>
              <p>
                <strong>One project, one specialist service or ongoing support.</strong>
              </p>
              <p>
                Startups often need senior digital capability before they are ready to build a
                large internal team. Others need a focused partner to rebuild a website, shape a
                product or solve a requirement that standard platforms cannot.
              </p>
              <p>
                Vorteks Digital brings the right mix of strategy, design, development and creative
                support to the brief. Scope stays clear, communication stays direct and the work is
                shaped around the business rather than a preset agency package.
              </p>
              <Link href="/contact">Discuss your project</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.working} content-section`}>
        <header>
          <h2 data-route-lines>What we can help with</h2>
          <div>
            <p>Flexible support for digital growth.</p>
            <span>(Services)</span>
          </div>
        </header>
        <div className={styles.workingBody}>
          <div className={styles.workingMedia} data-route-fade>
            <Image
              alt="Man reflected beside a Mandela portrait inside a Houghton café"
              fill
              sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 40vw"
              src="/images/johannesburg/houghton-cafe-portrait.webp"
            />
          </div>
          <ol>
            {principles.map((principle, index) => (
              <li data-route-fade key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}.</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Link className={styles.workingLink} href="/contact">
          Start a project enquiry
        </Link>
      </section>

      <section className={`${styles.partnership} content-section`}>
        <header>
          <h2 data-route-lines>A straightforward way to work</h2>
          <Link href="/contact">Tell us what you need</Link>
        </header>
        <ApproachCarousel />
      </section>

      <section className={`${styles.collaboration} content-section`}>
        <div className={styles.collaborationMedia} data-route-fade>
          <Image
            alt="Pedestrians walking between historic and modern buildings in Johannesburg"
            fill
            sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 49vw"
            src="/images/johannesburg/johannesburg-cbd-pedestrians.webp"
          />
        </div>
        <div className={styles.collaborationContent}>
          <h2 data-route-lines>Capability without unnecessary layers.</h2>
          <div data-route-fade>
            <p>
              Work directly with a flexible studio that can connect strategy, design, development,
              marketing and ongoing support. That means fewer hand-offs, clearer accountability and
              a solution shaped around the work in front of us.
            </p>
            <Link href="/contact">Discuss your requirements</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.callout} content-section`}>
        <span>(Contact)</span>
        <div>
          <h2 data-route-lines>For startups with serious digital work to do.</h2>
          <Link href="/contact">Start a conversation</Link>
        </div>
      </section>

      <ProjectTeasers />
    </div>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/approach' },
  description:
    'Explore website development, digital products, bespoke solutions and flexible digital support from Vorteks Digital.',
  title: 'Digital Services for Startups | Vorteks Digital',
}
