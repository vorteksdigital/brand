import type { Metadata } from 'next'

import styles from './cookie-policy.module.css'

export const metadata: Metadata = {
  alternates: { canonical: '/cookie-policy' },
  title: 'Cookie Policy | Vorteks Digital',
  description: 'How Vorteks Digital uses essential storage and optional analytics cookies.',
}

export default function CookiePolicyPage() {
  return (
    <main className={`${styles.page} content-page`} id="main-content">
      <article className={`${styles.article} content-section`}>
        <p className={styles.eyebrow}>(Cookie policy)</p>
        <h1>Cookies and analytics</h1>
        <div className={styles.content}>
          <section>
            <h2>What we store</h2>
            <p>
              This website stores your theme preference and analytics consent in your browser. These
              settings support the interface and remember your choice.
            </p>
          </section>
          <section>
            <h2>Optional analytics</h2>
            <p>
              Google Analytics loads only after you select “Got it”. It may then use cookies to
              measure visits and interactions. Vercel provides aggregated site analytics and
              performance measurements without using the Google Analytics consent value.
            </p>
          </section>
          <section>
            <h2>Your control</h2>
            <p>
              Before consent, Google Analytics remains disabled. You can withdraw consent by
              clearing this site’s stored data in your browser. The notice will appear again on your
              next visit.
            </p>
          </section>
          <section>
            <h2>Services used</h2>
            <ul>
              <li>Google Analytics 4 for optional audience measurement.</li>
              <li>Vercel Analytics and Speed Insights for aggregate usage and performance data.</li>
              <li>Local browser storage for consent and theme preferences.</li>
            </ul>
          </section>
          <section>
            <h2>Contact</h2>
            <p>Questions can be sent to info@vorteksdigital.co.za.</p>
          </section>
        </div>
      </article>
    </main>
  )
}
