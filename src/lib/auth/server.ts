import { createNeonAuth } from '@neondatabase/auth/next/server'
import { createHash } from 'node:crypto'

const baseUrl = process.env.NEON_AUTH_BASE_URL
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET
const payloadSecret = process.env.PAYLOAD_SECRET

if (!baseUrl) {
  throw new Error('Missing required environment variable: NEON_AUTH_BASE_URL')
}

if (!cookieSecret && !payloadSecret) {
  throw new Error('Missing NEON_AUTH_COOKIE_SECRET or PAYLOAD_SECRET')
}

const resolvedCookieSecret =
  cookieSecret || createHash('sha256').update(`neon-auth:${payloadSecret}`).digest('base64url')

export const auth = createNeonAuth({
  baseUrl,
  cookies: { secret: resolvedCookieSecret },
})
