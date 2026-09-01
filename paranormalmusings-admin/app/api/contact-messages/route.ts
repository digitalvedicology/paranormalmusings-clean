import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

/**
 * POST /api/contact-messages
 * Accept contact form submissions and send via Hostinger SMTP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      email: string
      message: string
      ipAddress: string
      userAgent?: string
      status?: string
    }

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Hostinger SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.paranormalmusings.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || 'contact@paranormalmusings.com',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })

    const recipientEmail = process.env.CONTACT_EMAIL_TO || 'paranormalmusings@proton.me'

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'contact@paranormalmusings.com',
      to: recipientEmail,
      replyTo: body.email,
      subject: `New contact form message from ${body.name}`,
      html: generateEmailHtml(body.name, body.email, body.message),
      text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[contact-messages] Error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
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
