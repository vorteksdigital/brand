import type { Metadata } from 'next'

import Link from 'next/link'

import { CopyEmail } from '@/components/ReferencePages/CopyEmail.client'
import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'

import styles from './contact.module.css'

const email = 'info@vorteksdigital.co.za'

export default function ContactPage() {
  return (
    <div className={styles.page} data-contact-page data-reference-route>
      <RouteAnimations />

      <section className={styles.hero}>
        <h1 aria-label="One team. Working together.">
          <span aria-hidden="true">
            <span data-route-hero-line>One team.</span>
          </span>
          <span aria-hidden="true">
            <span data-route-hero-line>Working together.</span>
          </span>
        </h1>
        <div className={styles.heroCopy}>
          <p data-route-hero-copy>
            We partner with ambitious teams to shape connected brands and digital experiences.
          </p>
          <p data-route-hero-copy>
            Our work aligns identity, content, products, and platforms inside one clear system.
          </p>
        </div>
      </section>

      <section aria-label="Contact options" className={`${styles.contactRows} content-section`}>
        <article data-route-fade>
          <h2>(New business)</h2>
          <div>
            <p>VRTKS Digital</p>
            <p>Johannesburg, South Africa</p>
            <CopyEmail email={email} />
          </div>
        </article>
        <article data-route-fade>
          <h2>(Careers)</h2>
          <div>
            <p className={styles.largeCopy}>
              We&apos;re always interested in people who think across design, systems, technology,
              and strategy.
            </p>
            <Link href={`mailto:${email}?subject=Careers at VRTKS Digital`}>Apply here</Link>
          </div>
        </article>
      </section>

      <ProjectTeasers />
    </div>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  description: 'Start a project or explore opportunities with VRTKS Digital in Johannesburg.',
  title: 'Contact | VRTKS Digital',
}
