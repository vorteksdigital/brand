const COMING_SOON_HOSTS = new Set(['vorteksdigital.co.za', 'www.vorteksdigital.co.za'])

const EXEMPT_PATH_PREFIXES = ['/admin', '/api', '/next', '/_next', '/coming-soon']

const PUBLIC_FILE_PATTERN = /\/[^/]+\.[^/]+$/

export function getHostname(hostHeader: string | null): string {
  const firstHost = hostHeader?.split(',')[0]?.trim().toLowerCase() ?? ''

  return firstHost.replace(/:\d+$/, '')
}

export function shouldShowComingSoon(hostHeader: string | null, pathname: string): boolean {
  if (!COMING_SOON_HOSTS.has(getHostname(hostHeader))) return false
  if (PUBLIC_FILE_PATTERN.test(pathname)) return false

  return !EXEMPT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
