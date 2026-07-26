const requiredServerVariables = ['DATABASE_URL', 'PAYLOAD_SECRET', 'PREVIEW_SECRET'] as const

export function validateEnvironment(): void {
  if (process.env.NEXT_PHASE === 'phase-production-build') return

  const missing = requiredServerVariables.filter((name) => !process.env[name]?.trim())
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const publicURL = process.env.NEXT_PUBLIC_SERVER_URL
  if (publicURL) {
    const parsed = new URL(publicURL)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('NEXT_PUBLIC_SERVER_URL must use http or https')
    }
  }
}
