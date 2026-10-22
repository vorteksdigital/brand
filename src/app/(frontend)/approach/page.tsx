import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/JsonLd'
import { HeroImageReveal } from '@/components/ReferencePages/HeroImageReveal.client'
import { ProjectTeasers } from '@/components/ReferencePages/ProjectTeasers'
import { RouteAnimations } from '@/components/ReferencePages/RouteAnimations.client'
import { services } from '@/data/services'
import { getServerSideURL } from '@/utilities/getURL'

import { ApproachCarousel } from './ApproachCarousel.client'
import styles from './approach.module.css'

const questions = [
  {
    answer:
      'We support web design, web development, WordPress and digital product work. A project can cover one focused service or connect several of them.',
    question: 'What can Vorteks Digital help with?',
  },
  {
    answer:
      'Yes. We work with businesses in Johannesburg, across South Africa and internationally. The project structure is adapted to the team, scope and time zone.',
    question: 'Do you work beyond Johannesburg?',
  },
  {
    answer:
      'Start with a short project enquiry. We clarify the business need, useful outcome, scope and constraints before recommending an approach or providing a quote.',
    question: 'How does a project begin?',
  },
]

export default function ApproachPage() {
  const baseURL = getServerSideURL()

  return (
    <div className={styles.page} data-approach-page data-reference-route>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `${baseURL}/approach#services`,
              areaServed: ['Johannesburg', 'South Africa', 'Worldwide'],
              name: 'Web design and development services',
              provider: { '@id': `${baseURL}/#business` },
              serviceType: services.map((service) => service.name),
              url: `${baseURL}/approach`,
            },
            {
              '@type': 'FAQPage',
              mainEntity: questions.map(({ answer, question }) => ({
                '@type': 'Question',
                acceptedAnswer: { '@type': 'Answer', text: answer },
                name: question,
              })),
            },
          ],
        }}
      />
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
              src="/images/johannesburg/johannesburg-mural-portrait.webp"
            />
          </div>
          <h1 aria-label="Digital support, built around your business.">
            <span aria-hidden="true">
              <span className={styles.heroTitleShift} data-hero-image-shift>
                <span data-route-hero-line>Digital support,</span>
              </span>
            </span>
            <span aria-hidden="true">
              <span data-route-hero-line>built around you.</span>
            </span>
          </h1>
        </div>
        <div className={styles.heroFooter}>
          <h2 data-route-hero-copy>
            Websites, digital products and bespoke solutions for startups worldwide.
          </h2>
          <span data-route-hero-copy>(Scroll)</span>
        </div>
      </section>

      <section className={`${styles.intro} content-section`}>
        <div className={styles.cue} aria-hidden="true">
          <ArrowRight />
        </div>
        <div className={styles.introContent}>
          <h2 data-route-lines>Choose the support you need, without buying an agency machine.</h2>
          <div className={styles.introDetails}>
            <span data-route-fade>(Approach)</span>
            <div data-route-fade>
              <p>
                <strong>One project, one specialist service or ongoing support.</strong>
              </p>
              <p>
                Startups often need senior digital capability before they are ready to build a large
                internal team. Others need a focused partner to rebuild a website, shape a product
                or solve a requirement that standard platforms cannot.
              </p>
              <p>
                Vorteks Digital brings the right mix of strategy, design, development and creative
                support to the brief. Scope stays clear, communication stays direct and the work is
                shaped around the business rather than a preset agency package.
              </p>
              <Link href="/contact">Discuss your project</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.working} content-section`}>
        <header>
          <h2 data-route-lines>
            What we can
            <br />
            help with
          </h2>
          <div>
            <p>Flexible support for digital growth.</p>
            <span>(Services)</span>
          </div>
        </header>
        <div className={styles.workingBody}>
          <div className={styles.workingMedia} data-route-fade data-working-media>
            <Image
              alt="Man reflected beside a Mandela portrait inside a Houghton café"
              fill
              sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 40vw"
              src="/images/johannesburg/houghton-cafe-portrait.webp"
            />
          </div>
          <ol data-working-list>
            {services.map((service, index) => (
              <li data-route-fade key={service.slug}>
                <span>{String(index + 1).padStart(2, '0')}.</span>
                <div>
                  <h3>
                    <Link href={`/services/${service.slug}`}>{service.name}</Link>
                  </h3>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link className={styles.workingLink} data-working-link href="/contact">
            Start a project enquiry
          </Link>
        </div>
      </section>

      <section className={`${styles.partnership} content-section`}>
        <header>
          <h2 data-route-lines>A straightforward way to work</h2>
          <Link href="/contact">Tell us what you need</Link>
        </header>
        <ApproachCarousel />
      </section>

      <section className={`${styles.questions} content-section`}>
        <header>
          <span data-route-fade>(Questions)</span>
          <h2 data-route-lines>Useful answers before we start.</h2>
        </header>
        <div className={styles.questionList}>
          {questions.map(({ answer, question }, index) => (
            <article data-route-fade key={question}>
              <span>{String(index + 1).padStart(2, '0')}.</span>
              <div>
                <h3>{question}</h3>
                <p>{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.collaboration} content-section`}>
        <div className={styles.collaborationMedia} data-route-fade>
          <Image
            alt="Pedestrians walking between historic and modern buildings in Johannesburg"
            fill
            sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 49vw"
            src="/images/johannesburg/johannesburg-cbd-pedestrians.webp"
          />
        </div>
        <div className={styles.collaborationContent}>
          <h2 data-route-lines>Capability without unnecessary layers.</h2>
          <div data-route-fade>
            <p>
              Work directly with a flexible studio that can connect strategy, design, development,
              marketing and ongoing support. That means fewer hand-offs, clearer accountability and
              a solution shaped around the work in front of us.
            </p>
            <Link href="/contact">Discuss your requirements</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.callout} content-section`}>
        <span>(Contact)</span>
        <div>
          <h2 data-route-lines>For startups with serious digital work to do.</h2>
          <Link href="/contact">Start a conversation</Link>
        </div>
      </section>

      <ProjectTeasers />
    </div>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/approach' },
  description:
    'Web design, web development, WordPress and digital product services from Vorteks Digital in Johannesburg, South Africa.',
  title: 'Web Design & Development Services Johannesburg | Vorteks Digital',
}
