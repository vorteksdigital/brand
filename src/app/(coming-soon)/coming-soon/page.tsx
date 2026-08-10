import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import styles from './page.module.css'

export const metadata: Metadata = {
  description: 'Vorteks Digital builds websites, digital products and bespoke solutions.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Coming Soon | Vorteks Digital',
}

export default function ComingSoonPage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link aria-label="Vorteks Digital home" className={styles.wordmark} href="/">
          <Image
            alt=""
            className={styles.wordmarkLogo}
            height={65}
            src="/logo-vrtks.svg"
            unoptimized
            width={500}
          />
        </Link>
        <p className={styles.status}>
          <span aria-hidden="true" className={styles.statusDot} />
          New site in progress
        </p>
      </header>

      <section aria-labelledby="coming-soon-title" className={styles.hero}>
        <p className={styles.eyebrow}>Vorteks Digital — Est. 2020</p>
        <h1 id="coming-soon-title">
          Coming
          <span>Soon.</span>
        </h1>
      </section>

      <footer className={styles.footer}>
        <p>
          Need a website, digital product or bespoke solution?
          <br />
          Start the conversation while our new site takes shape.
        </p>
        <a className={styles.contact} href="mailto:info@vorteksdigital.co.za">
          Start a project
          <ArrowUpRight aria-hidden="true" className={styles.contactIcon} strokeWidth={1.8} />
        </a>
      </footer>
    </main>
  )
}
