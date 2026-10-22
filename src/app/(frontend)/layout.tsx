import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { VercelInsights } from '@/components/Analytics/VercelInsights.client'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent.client'
import { GoogleAnalytics } from '@/components/GoogleAnalytics/GoogleAnalytics.client'
import { JsonLd } from '@/components/JsonLd'
import { PageTransition } from '@/components/PageTransition/PageTransition.client'
import { Footer } from '@/Footer/Component'
import { siteMono, siteSans } from '@/fonts'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(siteSans.variable, siteMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" sizes="any" type="image/svg+xml" />
      </head>
      <body>
        <GoogleAnalytics />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'ProfessionalService',
                '@id': `${getServerSideURL()}/#business`,
                name: 'Vorteks Digital',
                alternateName: 'VRTKS',
                url: getServerSideURL(),
                email: 'info@vorteksdigital.co.za',
                foundingDate: '2020',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Johannesburg',
                  addressRegion: 'Gauteng',
                  addressCountry: 'ZA',
                },
                areaServed: [
                  { '@type': 'City', name: 'Johannesburg' },
                  { '@type': 'Country', name: 'South Africa' },
                  'Worldwide',
                ],
                sameAs: [
                  'https://za.linkedin.com/company/vorteksdigital',
                  'https://www.instagram.com/vorteksdigital/',
                  'https://www.facebook.com/vorteksdigital/',
                ],
                knowsAbout: [
                  'Website development',
                  'Web design',
                  'WordPress development',
                  'Digital products',
                  'Bespoke digital solutions',
                  'Website maintenance',
                  'Digital marketing',
                  'Search engine optimization',
                  'Graphic design',
                ],
              },
              {
                '@type': 'WebSite',
                '@id': `${getServerSideURL()}/#website`,
                name: 'Vorteks Digital',
                url: getServerSideURL(),
                publisher: { '@id': `${getServerSideURL()}/#business` },
              },
            ],
          }}
        />
        <a
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded bg-white px-4 py-2 text-black shadow focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <PageTransition footer={<Footer />}>{children}</PageTransition>
        </Providers>
        <CookieConsent />
        <VercelInsights />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
