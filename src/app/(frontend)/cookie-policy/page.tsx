import type { Metadata } from 'next'

import { CookiePreferences } from '@/components/CookieConsent/CookiePreferences.client'

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
        <h1>Cookie policy</h1>
        <div className={styles.content}>
          <section>
            <h2>About this policy</h2>
            <p>
              This policy explains how Vorteks Digital uses cookies and similar browser storage on
              vorteksdigital.co.za. It was last updated on 21 October 2026.
            </p>
          </section>
          <section>
            <h2>Who is responsible</h2>
            <p>
              Vorteks Digital, Johannesburg, South Africa, controls the website data described in
              this policy. Contact info@vorteksdigital.co.za with privacy questions or requests.
            </p>
          </section>
          <section>
            <h2>Storage we use</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Provider</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>payload-theme</td>
                    <td>Vorteks Digital</td>
                    <td>Stores the selected light or dark interface theme.</td>
                    <td>Until removed</td>
                  </tr>
                  <tr>
                    <td>vrtks-analytics-consent</td>
                    <td>Vorteks Digital</td>
                    <td>Records whether optional analytics were accepted or rejected.</td>
                    <td>180 days</td>
                  </tr>
                  <tr>
                    <td>_ga and _ga_*</td>
                    <td>Google Analytics</td>
                    <td>Distinguishes visits and produces website usage statistics.</td>
                    <td>Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>Essential preferences</h2>
            <p>
              Theme and consent choices use local browser storage. They support requested settings
              and do not profile you. These preferences do not require analytics consent.
            </p>
          </section>
          <section>
            <h2>Optional Google Analytics</h2>
            <p>
              With your consent under GDPR Article 6(1)(a), Google Analytics 4 measurement ID
              G-4FCPRY0JBF processes page URLs, referrers, approximate location, device and browser
              information, timestamps, and interaction data to measure site use. Google Analytics
              stays disabled until you select Accept. Consent is never inferred from scrolling,
              ordinary navigation, silence, or inactivity.
            </p>
            <p>
              After acceptance, the Google tag loads on that acceptance click. On later visits, it
              waits for your first click, key press, touch, or scroll. Google may process data
              outside South Africa or the European Economic Area under its applicable contractual
              and transfer safeguards. Google states that its main _ga cookie lasts for two years;
              event-level GA4 retention depends on the property configuration.
            </p>
          </section>
          <section>
            <h2>Cookie-free service analytics</h2>
            <p>
              Vercel Web Analytics and Speed Insights start after the first click, key press, touch,
              or scroll. Vercel states that Web Analytics uses no cookies, stores aggregated data,
              does not retain IP addresses, and resets its derived visitor hash every 24 hours. We
              use this limited measurement for our legitimate interest in operating and improving
              the website under GDPR Article 6(1)(f).
            </p>
          </section>
          <section>
            <h2>Recipients and retention</h2>
            <p>
              Analytics data may be processed by Google and Vercel as service providers. Google
              Analytics cookies can remain for up to two years. The consent choice expires after 180
              days. Vercel documents a 24-hour lifespan for its derived visitor session. Server
              security logs may be retained separately where necessary to protect the service.
            </p>
          </section>
          <section>
            <h2>Your choices and rights</h2>
            <p>
              Accepting analytics is optional and refusing does not limit the website. You can
              change your choice as easily as you gave it. Rejecting below removes available Google
              Analytics cookies and reloads the page to stop further collection. You may also ask
              for access, correction, deletion, restriction, portability, or objection where the
              GDPR applies, and complain to your local supervisory authority.
            </p>
            <CookiePreferences />
          </section>
          <section>
            <h2>Policy updates</h2>
            <p>
              We will update this page when our technologies or purposes materially change. Where
              required, we will request consent again rather than treating continued browsing as
              acceptance.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
