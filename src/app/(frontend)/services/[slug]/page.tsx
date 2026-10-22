import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { HeroImageReveal } from '@/components/ReferencePages/HeroImageReveal.client'
import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'
import { getService, services } from '@/data/services'
import { getServerSideURL } from '@/utilities/getURL'
import Image from 'next/image'
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
    <article className={styles.page} data-reference-route data-service-page>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `${pageURL}#service`,
              name: service.name,
              description: service.description,
              image: `${baseURL}${service.heroImage.src}`,
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
                { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseURL}/approach` },
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

      <HeroImageReveal />
      <RouteAnimations />

      <header className={styles.hero}>
        <div className={styles.heroTitleWrap} data-hero-title-wrap>
          <div aria-hidden="true" className={styles.heroMedia} data-hero-image-reveal>
            <Image
              alt=""
              fill
              priority
              sizes="(max-width: 48rem) 44vw, 18vw"
              src={service.heroImage.src}
            />
          </div>
          <h1 aria-label={service.heading}>
            {service.heroLines.map((line, index) => (
              <span aria-hidden="true" key={line}>
                <span
                  className={index === 0 ? styles.heroTitleShift : undefined}
                  data-hero-image-shift={index === 0 ? '' : undefined}
                >
                  <span data-route-hero-line>{line}</span>
                </span>
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.heroFooter}>
          <h2 data-route-hero-copy>{service.intro}</h2>
          <span data-route-hero-copy>(Scroll)</span>
        </div>
      </header>

      <section className={`${styles.section} content-section`}>
        <div className={styles.sectionHeader}>
          <span data-route-fade>(What you get)</span>
          <h2 data-route-lines>A useful foundation, not decoration without purpose.</h2>
        </div>
        <ol className={styles.list}>
          {service.outcomes.map((outcome, index) => (
            <li data-route-fade key={outcome}>
              <span>{String(index + 1).padStart(2, '0')}.</span>
              <span>{outcome}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${styles.section} content-section`}>
        <div className={styles.sectionHeader}>
          <span data-route-fade>(Process)</span>
          <h2 data-route-lines>Clear stages. Connected decisions.</h2>
        </div>
        <ol className={styles.process}>
          {service.process.map((step, index) => (
            <li data-route-fade key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}.</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${styles.section} content-section`}>
        <div className={styles.sectionHeader}>
          <span data-route-fade>(Questions)</span>
          <h2 data-route-lines>Useful answers before we start.</h2>
        </div>
        <div className={styles.faqList}>
          {service.faqs.map((faq, index) => (
            <article data-route-fade key={faq.question}>
              <span>{String(index + 1).padStart(2, '0')}.</span>
              <div>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.callout} content-section`}>
        <span>(Contact)</span>
        <div>
          <h2 data-route-lines>Tell us what you need to make.</h2>
          <div className={styles.calloutLinks} data-route-fade>
            <Link href="/contact">Start a project enquiry</Link>
            <Link href="/approach">View all services</Link>
          </div>
        </div>
      </section>

      <ProjectTeasers />
    </article>
  )
}
