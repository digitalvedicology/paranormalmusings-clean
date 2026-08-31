import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for handling legacy URL redirects.
 *
 * Catches old flat-structure URLs (/slug/) and redirects to new structure
 * (/category/slug) based on the post's current category assignment.
 *
 * This runs on every request and uses ISR cache for performance.
 */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const { searchParams } = request.nextUrl
  const baseUrl = request.nextUrl.origin

  // Enforce canonical host: redirect www to apex
  if (request.nextUrl.hostname === 'www.paranormalmusings.com') {
    return NextResponse.redirect(
      `https://paranormalmusings.com${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
      { status: 301 }
    )
  }

  // Only process root-level paths that might be old article slugs
  // (not /category/*, /api/*, /images/*, etc.)
  const isRootPath = pathname === '/' || (pathname.split('/').length === 2 && pathname !== '/')
  const hasTrailingSlash = pathname.endsWith('/')
  const normalizedPath = hasTrailingSlash ? pathname.slice(0, -1) : pathname

  if (!isRootPath || pathname === '/' || !normalizedPath) {
    return NextResponse.next()
  }

  // Try to fetch content to determine the post's category
  try {
    const apiUrl = process.env.ADMIN_API_URL || 'http://localhost:3001'
    const canonicalHost = 'https://paranormalmusings.com'

    // Fetch the content doc to look up the post's category
    const response = await fetch(`${apiUrl}/api/content`, {
      next: { revalidate: 3600 }, // 1 hour cache
    })

    if (!response.ok) {
      return NextResponse.next()
    }

    const doc = await response.json()
    const slug = normalizedPath.slice(1) // Remove leading /

    // Find the post by slug
    const post = doc.posts?.find((p: any) => p.slug === slug)

    if (post && post.body?.length > 0) {
      // Post exists and has content, redirect to new URL
      const categoryHref = doc.categories?.find((c: any) => c.key === post.category)?.href || `/${post.category}`
      const newUrl = `${canonicalHost}${categoryHref}/${slug}`

      // Preserve query parameters (like ?page=)
      const queryString = searchParams.toString()
      const finalUrl = queryString ? `${newUrl}?${queryString}` : newUrl

      return NextResponse.redirect(finalUrl, { status: 301 })
    }
  } catch (error) {
    // If content fetch fails, fall through to normal handling
    console.warn('[middleware] Content lookup failed:', (error as Error).message)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
