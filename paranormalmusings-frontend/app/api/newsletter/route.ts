import { NextRequest, NextResponse } from 'next/server'

interface NewsletterData {
  email: string
  name?: string
}

/**
 * POST /api/newsletter
 *
 * Handles newsletter subscription with:
 * - Input validation
 * - Rate limiting (10 per IP per hour)
 * - Email validation
 * - Storage in Payload CMS
 *
 * Does not expose email address or API keys to client.
 */

// Simple rate limiter for newsletter
const newsletterLimiter = new Map<string, { count: number; resetTime: number }>()

function isNewsletterAllowed(ip: string): boolean {
  const now = Date.now()
  const limit = newsletterLimiter.get(ip)

  if (!limit || now > limit.resetTime) {
    newsletterLimiter.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }

  if (limit.count < 10) {
    limit.count++
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    if (!isNewsletterAllowed(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many subscription attempts. Please try again later.',
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = (await request.json()) as NewsletterData

    // Validate email
    if (!body.email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Name validation (optional)
    if (body.name && body.name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name too long (max 100 chars)' },
        { status: 400 }
      )
    }

    // Store in Payload CMS admin database
    const adminApiUrl = process.env.ADMIN_API_URL || 'http://localhost:3001'

    try {
      const payloadResponse = await fetch(`${adminApiUrl}/api/newsletter-subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: body.email.trim().toLowerCase(),
          name: body.name?.trim() || '',
          ipAddress: ip,
          userAgent: request.headers.get('user-agent'),
          status: 'subscribed',
          subscribedAt: new Date().toISOString(),
        }),
      })

      if (!payloadResponse.ok) {
        const error = await payloadResponse.text()
        console.error('[newsletter] Payload storage error:', error)

        // If it's a 409 (already exists), treat as success
        if (payloadResponse.status === 409) {
          return NextResponse.json(
            {
              success: true,
              message: 'You are already on the list.',
            },
            { status: 200 }
          )
        }

        return NextResponse.json(
          { success: false, error: 'Failed to process subscription. Please try again.' },
          { status: 500 }
        )
      }

      // Success
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you for subscribing! Check your email for confirmation.',
        },
        { status: 200 }
      )
    } catch (error) {
      console.error('[newsletter] Failed to store in Payload:', (error as Error).message)
      return NextResponse.json(
        { success: false, error: 'Failed to process subscription. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[newsletter] Unexpected error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
