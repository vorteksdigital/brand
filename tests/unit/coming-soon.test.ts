import { describe, expect, it } from 'vitest'

import { getHostname, shouldShowComingSoon } from '@/utilities/comingSoon'

describe('coming-soon domain gate', () => {
  it('normalizes forwarded host headers', () => {
    expect(getHostname('VORTEKSDIGITAL.CO.ZA:443')).toBe('vorteksdigital.co.za')
    expect(getHostname('www.vorteksdigital.co.za, proxy.internal')).toBe(
      'www.vorteksdigital.co.za',
    )
  })

  it('gates public pages on both custom domains', () => {
    expect(shouldShowComingSoon('vorteksdigital.co.za', '/')).toBe(true)
    expect(shouldShowComingSoon('www.vorteksdigital.co.za', '/posts/example')).toBe(true)
  })

  it('leaves local and Vercel preview hosts unchanged', () => {
    expect(shouldShowComingSoon('localhost:3000', '/')).toBe(false)
    expect(shouldShowComingSoon('vrtksdigitalcoza.vercel.app', '/about')).toBe(false)
  })

  it.each([
    '/admin',
    '/admin/login',
    '/api/users/me',
    '/next/preview',
    '/_next/static/app.js',
    '/coming-soon',
    '/favicon.ico',
    '/sitemap.xml',
    '/hero/brand-film.mp4',
  ])('does not gate infrastructure path %s', (pathname) => {
    expect(shouldShowComingSoon('vorteksdigital.co.za', pathname)).toBe(false)
  })
})
