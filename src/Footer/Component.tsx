import type { Footer as FooterData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './footer.module.css'

const defaultNavItems: NonNullable<FooterData['navItems']> = [
  { link: { label: 'home', type: 'custom', url: '/' } },
  { link: { label: 'projects', type: 'custom', url: '/projects' } },
  { link: { label: 'about', type: 'custom', url: '/about' } },
  { link: { label: 'blogs', type: 'custom', url: '/blogs' } },
  { link: { label: 'contact', type: 'custom', url: '/contact' } },
]

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('site-settings', 0)(),
  ])

  const navItems = footerData.navItems?.length ? footerData.navItems : defaultNavItems
  const organisation = siteSettings.organisation
  const studioName = organisation?.name || siteSettings.siteName || 'VRTKS Digital'
  const email = organisation?.email || 'info@vorteksdigital.co.za'
  const address = organisation?.address || 'Johannesburg, South Africa'
  const socialProfiles = siteSettings.socialProfiles || []
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.glow} />

      <div className={styles.inner}>
        <div className={styles.topGrid}>
          <nav aria-label="Footer navigation" className={styles.nav}>
            <p className={styles.eyebrow}>Explore</p>
            <ul className={styles.linkList}>
              {navItems.map(({ link }, index) => (
                <li key={`${link.label}-${index}`}>
                  <CMSLink className={styles.navLink} {...link} />
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contact}>
            <p className={styles.eyebrow}>Start a conversation</p>
            <a className={styles.contactLink} href={`mailto:${email}`}>
              <span>{email}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            {organisation?.telephone && (
              <a className={styles.telephone} href={`tel:${organisation.telephone}`}>
                {organisation.telephone}
              </a>
            )}
            <p className={styles.address}>{address}</p>
          </div>

          <div className={styles.studioCard}>
            <Image
              alt=""
              className={styles.cardMark}
              height={512}
              src="/favicon.svg"
              unoptimized
              width={512}
            />
            <div>
              <p>{studioName}</p>
              <span>Independent digital studio</span>
              <span>JHB · ZA</span>
            </div>
          </div>
        </div>

        <div className={styles.metaRow}>
          <p>
            ©{year} {studioName}.
            <br />
            All rights reserved.
          </p>

          {socialProfiles.length > 0 ? (
            <nav aria-label="Social links">
              <ul className={styles.socialList}>
                {socialProfiles.map((profile) => (
                  <li key={profile.id || profile.url}>
                    <a href={profile.url} rel="noopener noreferrer" target="_blank">
                      <span>{profile.label}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <p className={styles.descriptor}>Design, development &amp; digital experiences</p>
          )}

          <p className={styles.origin}>Made in Johannesburg</p>
        </div>

        <Link aria-label="VRTKS Digital home" className={styles.brand} href="/">
          <Image
            alt="VRTKS"
            className={styles.brandImage}
            height={65}
            src="/logo-vrtks.svg"
            unoptimized
            width={500}
          />
        </Link>
      </div>
    </footer>
  )
}
