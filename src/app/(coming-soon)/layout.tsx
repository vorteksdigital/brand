import React from 'react'

import { siteMono, siteSans } from '@/fonts'

import './styles.css'

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${siteSans.variable} ${siteMono.variable}`} lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
