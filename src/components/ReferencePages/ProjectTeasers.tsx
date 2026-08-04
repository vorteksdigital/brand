import Image from 'next/image'
import Link from 'next/link'

import styles from './shared.module.css'

const projects = [
  {
    alt: 'Johannesburg skyline glowing in warm evening light',
    client: 'Aperture',
    image: '/images/johannesburg/johannesburg-sunset-skyline.webp',
    title: 'Signal Shift',
  },
  {
    alt: 'Pedestrians and vehicles on Simmonds Street in central Johannesburg',
    client: 'Northstar',
    image: '/images/johannesburg/simmonds-street-johannesburg.webp',
    title: 'Clear Systems',
  },
]

export function ProjectTeasers() {
  return (
    <section aria-label="Selected case studies" className={`${styles.teasers} content-section`}>
      <div className={styles.teaserGrid}>
        {projects.map((project) => (
          <article className={styles.teaser} data-route-fade key={project.title}>
            <Link href="/projects">
              <div className={styles.teaserMedia}>
                <Image
                  alt={project.alt}
                  fill
                  sizes="(max-width: 47.99rem) calc(100vw - 2.875rem), 49vw"
                  src={project.image}
                />
              </div>
              <h2>{project.title}</h2>
              <p>({project.client})</p>
            </Link>
          </article>
        ))}
      </div>
      <Link className={styles.caseStudiesLink} href="/projects">
        View case studies
      </Link>
    </section>
  )
}
