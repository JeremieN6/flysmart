import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // /analyze → /analyse (avec query string)
  if (pathname === '/analyze') {
    const url = req.nextUrl.clone()
    url.pathname = '/analyse'
    url.search   = searchParams.toString() ? `?${searchParams}` : ''
    return NextResponse.redirect(url, 301)
  }

  // /pricing → /tarifs
  if (pathname === '/pricing') {
    const url = req.nextUrl.clone()
    url.pathname = '/tarifs'
    url.search   = searchParams.toString() ? `?${searchParams}` : ''
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/analyze', '/pricing'],
}
