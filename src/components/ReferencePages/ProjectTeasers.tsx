import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { getMediaUrl } from '@/utilities/getMediaUrl'

import styles from './shared.module.css'

export async function ProjectTeasers() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 2,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
  })

  return (
    <section aria-label="Selected case studies" className={`${styles.teasers} content-section`}>
      <div className={styles.teaserGrid}>
        {result.docs.length > 0 ? (
          result.docs.map((project) => {
            const media =
              typeof project.featuredImage === 'object' ? project.featuredImage : undefined
            const imageSource = media?.url ? getMediaUrl(media.url, media.updatedAt) : undefined

            return (
              <article className={styles.teaser} data-route-fade key={project.id}>
                <Link href="/projects">
                  <div className={styles.teaserMedia}>
                    {imageSource && (
                      <Image
                        alt={media?.alt || project.title}
                        fill
                        sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 49vw"
                        src={imageSource}
                      />
                    )}
                  </div>
                  <h2>{project.title}</h2>
                  <p>({project.client})</p>
                </Link>
              </article>
            )
          })
        ) : (
          <div data-route-fade>
            <h2>Approved case studies are being prepared.</h2>
            <p>Ask about relevant completed work when you send your project enquiry.</p>
          </div>
        )}
      </div>
      <Link className={styles.caseStudiesLink} href="/projects">
        View portfolio status
      </Link>
    </section>
  )
}
