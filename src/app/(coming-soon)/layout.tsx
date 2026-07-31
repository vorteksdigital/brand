import React from 'react'

import { siteMono, siteSans } from '@/fonts'

import './styles.css'

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${siteSans.variable} ${siteMono.variable}`} lang="en">
      <head>
        <link href="/favicon.svg" rel="icon" sizes="any" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
