import { NextRequest, NextResponse } from 'next/server'

/**
 * HTTP Basic Auth for staging environment.
 * Protects frontend.paranormalmusings.com from being crawled/indexed.
 *
 * IMPORTANT: This should be removed at launch (when deploying to production).
 * Keeping auth on production is a security risk and will prevent Google from crawling.
 *
 * To disable: Delete this file or set STAGING_BASIC_AUTH_DISABLED=true in environment.
 */

export function middleware(request: NextRequest) {
  // Only apply auth to staging domain
  const hostname = request.headers.get('host') || ''
  const isStaging = hostname.includes('paranormalmusings.com') && !hostname.includes('admin.')
  const isDisabled = process.env.STAGING_BASIC_AUTH_DISABLED === 'true'

  if (!isStaging || isDisabled) {
    return NextResponse.next()
  }

  // Check for basic auth header
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    // Return 401 with auth challenge
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Staging Environment"',
        'Cache-Control': 'no-store',
      },
    })
  }

  try {
    // Decode basic auth credentials
    const [scheme, encoded] = authHeader.split(' ')

    if (scheme !== 'Basic') {
      return new NextResponse('Invalid authentication scheme', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Staging Environment"',
        },
      })
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const [username, password] = decoded.split(':')

    // Verify credentials (from environment variables)
    const validUsername = process.env.STAGING_BASIC_AUTH_USERNAME || 'staging'
    const validPassword = process.env.STAGING_BASIC_AUTH_PASSWORD || 'changeme'

    if (username === validUsername && password === validPassword) {
      // Auth successful, continue to next middleware
      return NextResponse.next()
    }

    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Staging Environment"',
      },
    })
  } catch (error) {
    console.error('[auth] Basic auth validation failed:', error)
    return new NextResponse('Authentication failed', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Staging Environment"',
      },
    })
  }
}

export const config = {
  matcher: ['/((?!api/revalidate|_next/static|_next/image|favicon.ico).*)'],
}
