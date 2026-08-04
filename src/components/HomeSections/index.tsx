import configPromise from '@payload-config'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import type { Media, Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { HomeSectionsAnimations } from './HomeSections.client'
import styles from './index.module.css'

type HomeProject = {
  alt: string
  client: string
  href: string
  id: string
  image: string
  title: string
  year: number
}

const fallbackProjects: HomeProject[] = [
  {
    alt: 'Johannesburg skyline glowing in warm evening light',
    client: 'Aperture',
    href: '/projects',
    id: 'signal-shift',
    image: '/images/johannesburg/johannesburg-sunset-skyline.webp',
    title: 'Signal Shift',
    year: 2026,
  },
  {
    alt: 'Pedestrians and vehicles on Simmonds Street in central Johannesburg',
    client: 'Northstar',
    href: '/projects',
    id: 'clear-systems',
    image: '/images/johannesburg/simmonds-street-johannesburg.webp',
    title: 'Clear Systems',
    year: 2026,
  },
]

const toHomeProject = (project: Project): HomeProject => {
  const media =
    project.featuredImage && typeof project.featuredImage === 'object'
      ? (project.featuredImage as Media)
      : null

  return {
    alt: media?.alt || `${project.title} for ${project.client}`,
    client: project.client,
    href: project.projectURL || '/projects',
    id: String(project.id),
    image: media?.url
      ? getMediaUrl(media.url, media.updatedAt)
      : '/images/johannesburg/johannesburg-sunset-skyline.webp',
    title: project.title,
    year: project.year,
  }
}

export async function HomeSections() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
  })
  const projects =
    result.docs.length >= 2 ? result.docs.slice(0, 2).map(toHomeProject) : fallbackProjects
  const projectCount = result.docs.length || projects.length

  return (
    <div className={styles.sections} data-home-sections>
      <HomeSectionsAnimations />

      <section className={`${styles.approach} content-section`} data-home-approach>
        <div className={styles.approachCue}>
          <span className={styles.arrowCue} data-home-arrow>
            <ArrowRight aria-hidden="true" />
            <ArrowRight aria-hidden="true" />
          </span>
          <span>(Approach)</span>
        </div>

        <div className={styles.approachContent}>
          <h2 data-home-lines>
            We create digital systems and identities that unify teams across platforms, products,
            and brand.
          </h2>

          <div className={styles.approachDetails}>
            <span className={styles.approachLabel} data-home-fade>
              (Approach)
            </span>
            <div className={styles.approachCopy} data-home-fade>
              <p>
                <strong>Our work is the architecture behind how brands connect.</strong>
              </p>
              <p>
                Built to scale, our digital identities and systems extend across brand, marketing,
                product, and events. They unify teams around a shared way of expressing the brand,
                providing guidance on where the boundaries are, and how to push beyond them.
              </p>
              <p>
                This scale only works when it is rooted in intention. We define the why behind
                digital, the identity. The principles, logic, and design language informed by a
                brand&apos;s culture. This foundation brings purpose, alignment, and scalability
                across digital ecosystems.
              </p>
              <Link className={styles.textLink} href="/approach">
                Learn more about our approach
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Featured projects"
        className={`${styles.projects} content-section`}
        data-home-projects
      >
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <article className={styles.projectCard} data-home-project key={project.id}>
              <Link
                href={project.href}
                rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                target={project.href.startsWith('http') ? '_blank' : undefined}
              >
                <div className={styles.projectMedia}>
                  <Image
                    alt={project.alt}
                    fill
                    sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 48.4vw"
                    src={project.image}
                  />
                </div>
                <h3>
                  {project.title} {project.year}
                  <span>({project.client})</span>
                </h3>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.allProjectsWrap} data-home-fade>
          <Link className={styles.allProjects} href="/projects">
            <ArrowRight aria-hidden="true" />
            <span>See all projects</span>
            <small>({String(projectCount).padStart(2, '0')})</small>
          </Link>
        </div>
      </section>

      <section className={`${styles.studio} content-section`} data-home-studio>
        <div className={styles.studioContent}>
          <h2 data-home-lines>
            Boutique studio.
            <br />
            Global reach.
          </h2>
          <div className={styles.studioCopy} data-home-fade>
            <p>
              Systems are only as strong as the partnership behind them, so we operate as a boutique
              studio built for direct, collaborative work. We integrate seamlessly with in-house
              teams, functioning as an extension of the brand itself.
            </p>
            <p>We do not only work with brands. We become part of them.</p>
          </div>
          <div data-home-fade>
            <Link className={styles.textLink} href="/about">
              Learn more
            </Link>
          </div>
        </div>

        <div className={styles.studioMedia} data-home-fade>
          <Image
            alt="Man reflected beside a Mandela portrait inside a Houghton café"
            fill
            sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 49vw"
            src="/images/johannesburg/houghton-cafe-portrait.webp"
          />
        </div>
      </section>
    </div>
  )
}
