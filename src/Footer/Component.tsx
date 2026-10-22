import type { Footer as FooterData } from '@/payload-types'
import type { SVGProps } from 'react'

import { CMSLink } from '@/components/Link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { ArrowUpRight, Facebook, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './footer.module.css'

const InstagramFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Z"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      fillRule="evenodd"
    />
    <circle cx="17.5" cy="6.5" r="1.25" />
  </svg>
)

const defaultNavItems: NonNullable<FooterData['navItems']> = [
  { link: { label: 'home', type: 'custom', url: '/' } },
  { link: { label: 'projects', type: 'custom', url: '/projects' } },
  { link: { label: 'services', type: 'custom', url: '/services' } },
  { link: { label: 'about', type: 'custom', url: '/about' } },
  { link: { label: 'insights', type: 'custom', url: '/blogs' } },
  { link: { label: 'contact', type: 'custom', url: '/contact' } },
]

const footerSocialLinks = [
  {
    Icon: Linkedin,
    label: 'Vorteks Digital on LinkedIn',
    url: 'https://za.linkedin.com/company/vorteksdigital',
  },
  {
    Icon: InstagramFilled,
    label: 'Vorteks Digital on Instagram',
    url: 'https://www.instagram.com/vorteksdigital/',
  },
  {
    Icon: Facebook,
    label: 'Vorteks Digital on Facebook',
    url: 'https://www.facebook.com/vorteksdigital/',
  },
] as const

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('site-settings', 0)(),
  ])

  const navItems = footerData.navItems?.length ? footerData.navItems : defaultNavItems
  const organisation = siteSettings.organisation
  const studioName = organisation?.name || siteSettings.siteName || 'Vorteks Digital'
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
                  <CMSLink className={styles.navLink} prefetch={false} {...link} />
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

          <div className={styles.studioColumn}>
            <nav aria-label="Social media">
              <ul className={styles.socialIcons}>
                {footerSocialLinks.map(({ Icon, label, url }) => (
                  <li key={url}>
                    <a aria-label={label} href={url} rel="noopener noreferrer" target="_blank">
                      <Icon aria-hidden="true" fill="currentColor" stroke="none" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

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
                <span>Websites, products &amp; digital solutions</span>
                <span>Est. 2020 · Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metaRow}>
          <p>
            ©{year} {studioName}.
            <br />
            All rights reserved.
            <br />
            <Link className={styles.creditLink} href="/image-credits" prefetch={false}>
              Image Credits
            </Link>
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
            <p className={styles.descriptor}>High-quality work. Less agency overhead.</p>
          )}

          <p className={styles.origin}>Based in Johannesburg · Working worldwide</p>
        </div>

        <Link aria-label="Vorteks Digital home" className={styles.brand} href="/" prefetch={false}>
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
