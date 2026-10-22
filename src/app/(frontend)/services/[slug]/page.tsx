import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { getService, services } from '@/data/services'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import styles from '../services.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug)
  if (!service) return {}

  return {
    alternates: { canonical: `/services/${service.slug}` },
    description: service.description,
    title: service.title,
  }
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug)
  if (!service) notFound()

  const baseURL = getServerSideURL()
  const pageURL = `${baseURL}/services/${service.slug}`

  return (
    <article className={styles.page}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `${pageURL}#service`,
              name: service.name,
              description: service.description,
              areaServed: [
                { '@type': 'City', name: 'Johannesburg' },
                { '@type': 'Country', name: 'South Africa' },
              ],
              provider: { '@id': `${baseURL}/#business` },
              url: pageURL,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseURL },
                { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseURL}/services` },
                { '@type': 'ListItem', position: 3, name: service.name, item: pageURL },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: service.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            },
          ],
        }}
      />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>{service.eyebrow}</p>
        <h1>{service.heading}</h1>
        <div className={styles.heroIntro}>
          <p>{service.intro}</p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>(What you get)</p>
          <h2>A useful foundation, not decoration without purpose.</h2>
        </div>
        <ol className={styles.list}>
          {service.outcomes.map((outcome, index) => (
            <li key={outcome}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{outcome}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>(Process)</p>
          <h2>Clear stages. Connected decisions.</h2>
        </div>
        <ol className={styles.process}>
          {service.process.map((step, index) => (
            <li key={step.title}>
              <span className={styles.processNumber}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>(Questions)</p>
          <h2>Useful answers before we start.</h2>
        </div>
        <div className={styles.faqList}>
          {service.faqs.map((faq) => (
            <article className={styles.faqItem} key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <p>Tell us what you need to make.</p>
        <div>
          <Link className={styles.link} href="/contact">
            Start a project enquiry
          </Link>
          {' · '}
          <Link className={styles.link} href="/services">
            View all services
          </Link>
        </div>
      </section>
    </article>
  )
}
