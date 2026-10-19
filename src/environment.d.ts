declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      DATABASE_URL_UNPOOLED?: string
      NEON_BRANCH?: string
      NEON_AUTH_BASE_URL: string
      NEON_AUTH_JWKS_URL?: string
      NEON_AUTH_COOKIE_SECRET?: string
      NEXT_PUBLIC_SERVER_URL: string
      RESEND_API_KEY?: string
      RESEND_FROM_ADDRESS?: string
      RESEND_FROM_NAME?: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
