import type { Metadata } from 'next'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { imageCredits, videoCredits } from '@/data/imageCredits'

import styles from './image-credits.module.css'

export default function ImageCreditsPage() {
  return (
    <main className={`${styles.page} content-page`}>
      <header className={`${styles.header} content-section`}>
        <p>(Image credits)</p>
        <h1>Editorial photography and motion</h1>
        <p>
          Images were discovered through Cosmos, verified against their original source, and stored
          locally for this website.
        </p>
      </header>

      <section aria-labelledby="credits-heading" className={`${styles.credits} content-section`}>
        <h2 id="credits-heading">Sources and usage</h2>
        <ol className={styles.list}>
          {imageCredits.map((credit, index) => (
            <li className={styles.credit} key={credit.fileName}>
              <div className={styles.thumbnail}>
                <Image
                  alt={credit.alt}
                  fill
                  sizes="(max-width: 48rem) 100vw, 28vw"
                  src={credit.localPath}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.index}>{String(index + 1).padStart(2, '0')}.</p>
                <h3>{credit.title}</h3>
                <dl>
                  <div>
                    <dt>Creator</dt>
                    <dd>{credit.creator}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>
                      {credit.verifiedLocation}
                      {credit.specificLocation ? ` — ${credit.specificLocation}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt>Used on</dt>
                    <dd>{credit.usageLocations.join('; ')}</dd>
                  </div>
                  <div>
                    <dt>Content match</dt>
                    <dd>{credit.contextMatch}</dd>
                  </div>
                  <div>
                    <dt>Palette match</dt>
                    <dd>{credit.paletteMatch}</dd>
                  </div>
                  <div>
                    <dt>Attribution</dt>
                    <dd>{credit.requiredAttribution}</dd>
                  </div>
                </dl>
                <div className={styles.links}>
                  <a href={credit.sourceUrl} rel="noopener noreferrer" target="_blank">
                    <span>Original on {credit.sourceName}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a href={credit.cosmosUrl} rel="noopener noreferrer" target="_blank">
                    <span>Cosmos search used</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a href={credit.licenseUrl} rel="noopener noreferrer" target="_blank">
                    <span>{credit.license}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          ))}
          {videoCredits.map((credit, index) => (
            <li className={styles.credit} key={credit.fileName}>
              <div className={styles.thumbnail}>
                <video
                  aria-label={credit.ariaLabel}
                  controls
                  muted
                  playsInline
                  poster={credit.posterPath}
                  preload="metadata"
                  src={credit.localPath}
                />
              </div>
              <div className={styles.details}>
                <p className={styles.index}>
                  {String(imageCredits.length + index + 1).padStart(2, '0')}.
                </p>
                <h3>{credit.title}</h3>
                <dl>
                  <div>
                    <dt>Creator</dt>
                    <dd>{credit.creator}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>
                      {credit.verifiedLocation} — {credit.specificLocation}
                    </dd>
                  </div>
                  <div>
                    <dt>Used on</dt>
                    <dd>{credit.usageLocations.join('; ')}</dd>
                  </div>
                  <div>
                    <dt>Content match</dt>
                    <dd>{credit.contextMatch}</dd>
                  </div>
                  <div>
                    <dt>Palette match</dt>
                    <dd>{credit.paletteMatch}</dd>
                  </div>
                  <div>
                    <dt>Attribution</dt>
                    <dd>{credit.requiredAttribution}</dd>
                  </div>
                </dl>
                <div className={styles.links}>
                  <a href={credit.sourceUrl} rel="noopener noreferrer" target="_blank">
                    <span>Original on {credit.sourceName}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a href={credit.cosmosUrl} rel="noopener noreferrer" target="_blank">
                    <span>Cosmos search used</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a href={credit.licenseUrl} rel="noopener noreferrer" target="_blank">
                    <span>{credit.license}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  alternates: { canonical: '/image-credits' },
  description:
    'Credits and licensing details for editorial photography and motion used by VRTKS Digital.',
  title: 'Image Credits | VRTKS Digital',
}
