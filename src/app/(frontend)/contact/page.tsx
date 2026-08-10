import type { Metadata } from 'next'

import Link from 'next/link'
import Image from 'next/image'

import { CopyEmail } from '@/components/ReferencePages/CopyEmail.client'
import { HeroImageReveal } from '@/components/ReferencePages/HeroImageReveal.client'
import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'

import styles from './contact.module.css'

const email = 'info@vorteksdigital.co.za'

export default function ContactPage() {
  return (
    <div className={styles.page} data-contact-page data-reference-route>
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
              src="/images/johannesburg/simmonds-street-johannesburg.webp"
            />
          </div>
          <h1 aria-label="Start a project. Build what matters.">
            <span aria-hidden="true">
              <span className={styles.heroTitleShift} data-hero-image-shift>
                <span data-route-hero-line>Start a project.</span>
              </span>
            </span>
            <span aria-hidden="true">
              <span data-route-hero-line>Build what matters.</span>
            </span>
          </h1>
        </div>
        <div className={styles.heroFooter}>
          <h2 data-route-hero-copy>
            Tell us what you need. We&apos;ll help shape the right digital solution.
          </h2>
          <span data-route-hero-copy>(Scroll)</span>
        </div>
      </section>

      <section aria-label="Contact options" className={`${styles.contactRows} content-section`}>
        <article data-route-fade>
          <h2>(New business)</h2>
          <div>
            <p>Vorteks Digital</p>
            <p>Johannesburg, South Africa</p>
            <CopyEmail email={email} />
          </div>
        </article>
        <article data-route-fade>
          <h2>(What to include)</h2>
          <div>
            <p className={styles.largeCopy}>
              Share your business, the problem to solve, what you need, your timing, and any budget
              range already in mind.
            </p>
            <Link href={`mailto:${email}?subject=Project enquiry for Vorteks Digital`}>
              Start a conversation
            </Link>
          </div>
        </article>
      </section>

      <ProjectTeasers />
    </div>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  description:
    'Contact Vorteks Digital about a website, digital product, bespoke solution, or ongoing digital support.',
  title: 'Start a Project | Contact Vorteks Digital',
}
