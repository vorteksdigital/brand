'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

import styles from './shared.module.css'

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
  }

  return (
    <div className={styles.emailRow}>
      <a href={`mailto:${email}`}>{email}</a>
      <button aria-live="polite" onClick={copyEmail} type="button">
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
