'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect, useState } from 'react'

export function VercelInsights() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const activate = () => setActive(true)
    const options = { once: true, passive: true }

    window.addEventListener('keydown', activate, options)
    window.addEventListener('pointerdown', activate, options)
    window.addEventListener('touchstart', activate, options)
    window.addEventListener('wheel', activate, options)

    return () => {
      window.removeEventListener('keydown', activate)
      window.removeEventListener('pointerdown', activate)
      window.removeEventListener('touchstart', activate)
      window.removeEventListener('wheel', activate)
    }
  }, [])

  if (!active) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
