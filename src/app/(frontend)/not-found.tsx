import Link from 'next/link'

import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <>
      <title>Page Not Found | VRTKS Digital</title>
      <section aria-labelledby="not-found-title" className={styles.page} data-not-found-page>
        <h1 className={styles.code} data-not-found-code id="not-found-title">
          <span aria-hidden="true">404</span>
          <span className="sr-only">Page not found</span>
        </h1>

        <div className={styles.message}>
          <p>Oops, not sure how you got here.</p>
          <Link className={styles.homeLink} href="/">
            Back to home
          </Link>
        </div>
      </section>
    </>
  )
}
