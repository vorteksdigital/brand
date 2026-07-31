import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { shouldShowComingSoon } from '@/utilities/comingSoon'

export function proxy(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')

  if (!shouldShowComingSoon(host, request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const destination = request.nextUrl.clone()
  destination.pathname = '/coming-soon'

  return NextResponse.rewrite(destination)
}

export const config = {
  matcher: '/:path*',
}
