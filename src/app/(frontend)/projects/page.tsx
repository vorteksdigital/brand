import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { getMediaUrl } from '@/utilities/getMediaUrl'

import { InfiniteProjectRail } from './InfiniteProjectRail.client'
import styles from './projects.module.css'

export const revalidate = 600

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
  })

  return (
    <div className={`route-shell ${styles.page}`} data-projects-page data-route-shell>
      <h1 className="sr-only">Projects</h1>

      <section aria-label="Selected projects" className={styles.projectSection}>
        {result.docs.length > 0 ? (
          <InfiniteProjectRail>
            {result.docs.map((project, index) => {
            const image =
              project.featuredImage && typeof project.featuredImage === 'object'
                ? project.featuredImage
                : null
            const imageSource = image?.url ? getMediaUrl(image.url, image.updatedAt) : null

            return (
              <article className={styles.card} key={project.id}>
                <div className={styles.imageFrame}>
                  {imageSource ? (
                    <Image
                      alt={image?.alt || `${project.title} for ${project.client}`}
                      className={styles.image}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 48rem) 82vw, 28.2vw"
                      src={imageSource}
                    />
                  ) : (
                    <div aria-hidden="true" className={styles.imageFallback} />
                  )}
                </div>

                <h2 className={styles.title}>
                  {project.title} {project.year}
                  <span>({project.client})</span>
                </h2>
              </article>
            )
            })}
          </InfiniteProjectRail>
        ) : (
          <div className={styles.emptyState}>
            <h2>Approved portfolio work is being prepared.</h2>
            <p>
              Vorteks Digital has completed project work, but client and case-study details will
              only appear here once cleared for public use.
            </p>
            <Link href="/contact">Ask about relevant work</Link>
          </div>
        )}

        {result.docs.length > 0 && (
          <div className={styles.scrollMeta}>
            <p>Selected client work</p>
            <p aria-hidden="true">(Scroll)</p>
          </div>
        )}
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: '/projects',
    },
    description:
      'View approved website, digital product and bespoke solution work from Vorteks Digital as it becomes available.',
    title: 'Digital Portfolio | Vorteks Digital',
  }
}
