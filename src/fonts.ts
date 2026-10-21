import { GeistMono } from 'geist/font/mono'
import { Inter } from 'next/font/google'

export const siteMono = GeistMono

export const siteSans = Inter({
  display: 'optional',
  subsets: ['latin'],
  variable: '--font-inter',
})
