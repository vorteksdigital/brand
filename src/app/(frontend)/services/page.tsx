import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { services } from '@/data/services'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'

import styles from './services.module.css'

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  description:
    'Web design, web development, WordPress and digital product services from Vorteks Digital in Johannesburg, South Africa.',
  title: 'Web Design & Development Services Johannesburg | Vorteks Digital',
}

export default function ServicesPage() {
  const baseURL = getServerSideURL()

  return (
    <div className={styles.page}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${baseURL}/services/${service.slug}`,
            name: service.name,
          })),
        }}
      />
      <header className={styles.indexHero}>
        <p className={styles.eyebrow}>(Services)</p>
        <h1>Web design and development services.</h1>
        <p>
          Vorteks Digital helps Johannesburg and South African businesses plan, design, build and
          improve useful digital experiences.
        </p>
      </header>
      <section aria-label="Services">
        <ul className={styles.serviceGrid}>
          {services.map((service, index) => (
            <li className={styles.serviceCard} key={service.slug}>
              <Link href={`/services/${service.slug}`}>
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.closing}>
        <p>Need a clearer route forward?</p>
        <Link className={styles.link} href="/contact">
          Start a project
        </Link>
      </section>
    </div>
  )
}
