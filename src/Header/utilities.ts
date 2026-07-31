import type { Header } from '@/payload-types'

type HeaderLink = {
  label?: string | null
  reference?:
    | {
        relationTo: 'pages' | 'posts'
        value: { slug?: string | null } | number | string
      }
    | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const defaultHeaderNavItems: NonNullable<Header['navItems']> = [
  {
    link: {
      label: 'projects',
      type: 'custom',
      url: '/cases',
    },
  },
  {
    link: {
      label: 'about',
      type: 'custom',
      url: '/about',
    },
  },
  {
    link: {
      label: 'contact',
      type: 'custom',
      url: '/contact',
    },
  },
]

export function formatCapeTownTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-ZA', {
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  }).format(date)
}

export function getLocationAndTime(date: Date = new Date()): string {
  return `cpt, south africa ${formatCapeTownTime(date)}`
}

export function getNavHref(link: HeaderLink): string | null {
  if (link.type !== 'reference') return link.url || null

  const reference = link.reference

  if (!reference || typeof reference.value !== 'object' || !reference.value?.slug) return null

  return `${reference.relationTo === 'posts' ? '/posts' : ''}/${reference.value.slug}`
}

export function isActiveRoute(pathname: string, href: string): boolean {
  if (!href.startsWith('/')) return false

  const hrefPath = href.split(/[?#]/)[0] || '/'

  if (hrefPath === '/') return pathname === '/'

  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)
}
