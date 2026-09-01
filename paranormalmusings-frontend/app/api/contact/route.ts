import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { contactFormLimiter } from '@/lib/rate-limiter'

// Initialize SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface ContactFormData {
  name: string
  email: string
  message: string
  honeypot?: string
  'cf-turnstile-response'?: string
}

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

/**
 * POST /api/contact
 *
 * Handles contact form submissions with:
 * - Input validation
 * - Rate limiting (5 per IP per hour)
 * - Honeypot spam protection
 * - Cloudflare Turnstile verification
 * - Email delivery via Resend
 * - Storage in Payload CMS
 *
 * Does not expose email address or API keys to client.
 */

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    if (!contactFormLimiter.isAllowed(ip)) {
      const remaining = contactFormLimiter.getRemainingTime(ip)
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(remaining / 1000),
        },
        { status: 429, headers: { 'Retry-After': Math.ceil(remaining / 1000).toString() } }
      )
    }

    // Parse request body
    const body = (await request.json()) as ContactFormData

    // Validate required fields
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Length validation
    if (body.name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name too long (max 100 chars)' },
        { status: 400 }
      )
    }
    if (body.message.length < 10 || body.message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be 10-5000 characters' },
        { status: 400 }
      )
    }

    // Honeypot check - if filled, silently succeed (fool spam bots)
    if (body.honeypot) {
      return NextResponse.json(
        { success: true, message: 'Thank you. We have received your message.' },
        { status: 200 }
      )
    }

    // Verify Turnstile token if present
    if (body['cf-turnstile-response']) {
      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
      const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

      if (!turnstileSecret) {
        console.warn('[contact] Turnstile secret not configured, skipping verification')
      } else {
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: body['cf-turnstile-response'],
          }),
        })

        const turnstileResult = (await verifyResponse.json()) as TurnstileVerifyResponse

        if (!turnstileResult.success) {
          console.warn('[contact] Turnstile verification failed:', turnstileResult['error-codes'])
          return NextResponse.json(
            { success: false, error: 'Security verification failed. Please try again.' },
            { status: 400 }
          )
        }
      }
    }

    // Send email via Nodemailer SMTP
    let emailSent = false
    const contactEmailTo = process.env.CONTACT_EMAIL_TO || 'test@paranormalmusings.com'

    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: contactEmailTo,
          replyTo: body.email,
          subject: `New contact form message from ${body.name}`,
          html: generateEmailHtml(body.name, body.email, body.message),
          text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
        })

        emailSent = true
      } catch (error) {
        console.error('[contact] Failed to send email via SMTP:', (error as Error).message)
      }
    } else {
      console.warn('[contact] SMTP not configured - set SMTP_USER and SMTP_PASSWORD')
    }

    // Store in Payload CMS
    let storedInPayload = false
    const adminApiUrl = process.env.ADMIN_API_URL || 'http://localhost:3001'

    try {
      const payloadResponse = await fetch(`${adminApiUrl}/api/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          message: body.message,
          ipAddress: ip,
          userAgent: request.headers.get('user-agent'),
          status: 'new',
        }),
      })

      if (payloadResponse.ok) {
        storedInPayload = true
      } else {
        const error = await payloadResponse.text()
        console.error('[contact] Payload storage error:', error)
      }
    } catch (error) {
      console.error('[contact] Failed to store in Payload:', (error as Error).message)
    }

    // If neither email nor storage worked, fail
    if (!emailSent && !storedInPayload) {
      return NextResponse.json(
        { success: false, error: 'Failed to process message. Please try again later.' },
        { status: 500 }
      )
    }

    // Success - message was sent/stored
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you. We have received your message. We read everything but cannot reply to every message.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[contact] Unexpected error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

function generateEmailHtml(name: string, email: string, message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #8b7355; padding-bottom: 10px; margin-bottom: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .message { background: #f9f9f9; padding: 15px; border-left: 3px solid #8b7355; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Message</h2>
    </div>

    <div class="field">
      <div class="label">From:</div>
      <div>${escapeHtml(name)}</div>
    </div>

    <div class="field">
      <div class="label">Reply to:</div>
      <div><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
    </div>

    <div class="message">
      <div class="label">Message:</div>
      <div>${escapeHtml(message).replace(/\n/g, '<br>')}</div>
    </div>

    <div class="footer">
      <p>This email was sent from the Paranormal Musings contact form.</p>
    </div>
  </div>
</body>
</html>
  `
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
