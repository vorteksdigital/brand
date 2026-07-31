import type { Metadata } from 'next'
import Link from 'next/link'

import styles from './page.module.css'

export const metadata: Metadata = {
  description: 'A new VRTKS Digital experience is taking shape.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Coming Soon | VRTKS Digital',
}

export default function ComingSoonPage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link aria-label="VRTKS Digital home" className={styles.wordmark} href="/">
          VRTKS<span>/Digital</span>
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
          We&apos;re shaping a new digital experience.
          <br />
          Let&apos;s make something remarkable in the meantime.
        </p>
        <a className={styles.contact} href="mailto:info@vorteksdigital.co.za">
          Start a project
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  )
}
