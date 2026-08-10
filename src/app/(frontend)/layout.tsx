import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
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
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'Vorteks Digital',
                alternateName: 'VRTKS',
                url: getServerSideURL(),
                email: 'info@vorteksdigital.co.za',
                foundingDate: '2020',
                areaServed: 'Worldwide',
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
                name: 'Vorteks Digital',
                url: getServerSideURL(),
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
