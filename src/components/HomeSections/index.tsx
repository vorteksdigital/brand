import configPromise from '@payload-config'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import type { Media, Project } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { HomeSectionsAnimations } from './HomeSections.client'
import styles from './index.module.css'
import { ServicesShowcase } from './ServicesShowcase.client'

type HomeProject = {
  alt: string
  client: string
  href: string
  id: string
  image: string
  title: string
  year: number
}

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
  const projects = result.docs.slice(0, 2).map(toHomeProject)
  const projectCount = result.docs.length

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
            Digital support that fits the business you&apos;re building.
          </h2>

          <div className={styles.approachDetails}>
            <span className={styles.approachLabel} data-home-fade>
              (Approach)
            </span>
            <div className={styles.approachCopy} data-home-fade>
              <p>
                <strong>Start with what your business needs now.</strong>
              </p>
              <p>
                Vorteks Digital designs and builds websites, digital products and bespoke digital
                solutions for startups and growing businesses worldwide.
              </p>
              <p>
                Need broader support? Brand, motion, WordPress, maintenance, SEO, marketing and
                graphic design can join the same practical delivery plan. You get the capability
                you need without paying for layers you do not.
              </p>
              <Link className={styles.textLink} href="/approach">
                See how we work
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
          {projects.length > 0 ? (
            projects.map((project) => (
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
            ))
          ) : (
            <div data-home-fade>
              <h3>Approved portfolio work is being prepared for publication.</h3>
              <p>Ask about relevant completed projects when you contact us.</p>
            </div>
          )}
        </div>

        <div className={styles.allProjectsWrap} data-home-fade>
          <Link className={styles.allProjects} href="/projects">
            <ArrowRight aria-hidden="true" />
            <span>{projectCount > 0 ? 'See all projects' : 'Ask about our work'}</span>
            <small>({String(projectCount).padStart(2, '0')})</small>
          </Link>
        </div>
      </section>

      <section className={`${styles.services} content-section`} data-home-services>
        <div className={styles.servicesIntro}>
          <span>(Services)</span>
          <h2 data-home-lines>From core brand foundations to high-impact digital experiences.</h2>
          <Link className={styles.textLink} data-home-fade href="/approach">
            Learn more about our approach
          </Link>
        </div>

        <ServicesShowcase />
      </section>

      <section className={`${styles.studio} content-section`} data-home-studio>
        <div className={styles.studioContent}>
          <h2 data-home-lines>
            Direct partnership.
            <br />
            Global delivery.
          </h2>
          <div className={styles.studioCopy} data-home-fade>
            <p>
              Since 2020, Vorteks Digital has worked as a flexible studio for businesses that need
              senior digital capability without a large-agency structure.
            </p>
            <p>Work directly with the people shaping and delivering your solution.</p>
          </div>
          <div data-home-fade>
            <Link className={styles.textLink} href="/about">
              About Vorteks Digital
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
