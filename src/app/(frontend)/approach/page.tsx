import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'

import { ApproachCarousel } from './ApproachCarousel.client'
import styles from './approach.module.css'

const principles = [
  {
    body: 'Every system begins with context. We define what the brand needs to communicate, who it serves, and which principles should guide decisions over time.',
    title: 'Intention before execution',
  },
  {
    body: 'Scale needs structure without sameness. We create connected systems that stay recognisable while flexing across platforms, products, and audiences.',
    title: 'Consistency with flexibility',
  },
  {
    body: 'We solve alongside internal teams. Shared language, open working sessions, and clear documentation make each system easier to own and extend.',
    title: 'Shared ownership',
  },
]

export default function ApproachPage() {
  return (
    <div className={styles.page} data-approach-page data-reference-route>
      <RouteAnimations />

      <section className={styles.hero}>
        <h1 aria-label="Digital, built to scale.">
          <span aria-hidden="true">
            <span data-route-hero-line>Digital,</span>
          </span>
          <span aria-hidden="true">
            <span data-route-hero-line>built to scale.</span>
          </span>
        </h1>
        <div className={styles.heroFooter}>
          <h2 data-route-hero-copy>
            The system, strategy &amp; architecture behind how brands show up.
          </h2>
          <span data-route-hero-copy>(Scroll)</span>
        </div>
      </section>

      <section className={`${styles.intro} content-section`}>
        <div className={styles.cue} aria-hidden="true">
          <ArrowRight />
        </div>
        <div className={styles.introContent}>
          <h2 data-route-lines>We don&apos;t work around brand teams. We become part of them.</h2>
          <div className={styles.introDetails}>
            <span data-route-fade>(Approach)</span>
            <div data-route-fade>
              <p>
                <strong>Intentional. Consistent. Built to scale.</strong>
              </p>
              <p>
                Inside complex organisations, digital work can fracture across brand, product,
                marketing, content, and regions. Without shared structure, good work starts to
                drift.
              </p>
              <p>
                Our role is to bring clarity to that complexity. We define intent with in-house
                teams, then translate it into robust systems people understand and can extend.
              </p>
              <Link href="/contact">Let&apos;s work together</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.working} content-section`}>
        <header>
          <h2 data-route-lines>Working, together</h2>
          <div>
            <p>True partnership for brand teams.</p>
            <span>(Benefits)</span>
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
          Let&apos;s work together
        </Link>
      </section>

      <section className={`${styles.partnership} content-section`}>
        <header>
          <h2 data-route-lines>Partnership, in practice</h2>
          <Link href="/contact">Let&apos;s work together</Link>
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
          <h2 data-route-lines>A collaborative partnership.</h2>
          <div data-route-fade>
            <p>
              Our process is collaborative and iterative. We work through strategy, design,
              development, and systemisation beside internal teams, pressure-testing ideas against
              real use cases.
            </p>
            <Link href="/contact">Let&apos;s work together</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.callout} content-section`}>
        <span>(Contact)</span>
        <div>
          <h2 data-route-lines>For brand teams building at scale.</h2>
          <Link href="/contact">Let&apos;s work together</Link>
        </div>
      </section>

      <ProjectTeasers />
    </div>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/approach' },
  description: 'How VRTKS Digital creates connected brand systems and digital experiences.',
  title: 'Approach | VRTKS Digital',
}
