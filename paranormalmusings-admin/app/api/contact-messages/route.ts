import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const MESSAGES_FILE = path.join(DATA_DIR, 'contact-messages.json')

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  ipAddress: string
  userAgent?: string
  status: string
  createdAt: string
  emailSent?: boolean
}

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf8')
    return JSON.parse(data) as ContactMessage[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8')
}

async function sendEmail(name: string, email: string, message: string): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || 'contact@paranormalmusings.com',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })

    const recipientEmail = process.env.CONTACT_EMAIL_TO || 'paranormalmusings@proton.me'

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'contact@paranormalmusings.com',
      to: recipientEmail,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: generateEmailHtml(name, email, message),
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    console.log(`[contact-messages] Email sent to ${recipientEmail}`)
    return true
  } catch (error) {
    console.warn(`[contact-messages] Email send failed: ${(error as Error).message}`)
    return false
  }
}

/**
 * POST /api/contact-messages
 * Accept contact form submissions, store to JSON, and send email notification.
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

    const now = new Date().toISOString()
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Try to send email
    const emailSent = await sendEmail(body.name, body.email, body.message)

    const message: ContactMessage = {
      id: messageId,
      name: body.name,
      email: body.email,
      message: body.message,
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
      status: body.status || 'new',
      createdAt: now,
      emailSent,
    }

    const messages = await readMessages()
    messages.unshift(message)
    await writeMessages(messages)

    console.log(`[contact-messages] New message stored from ${body.name} (${body.email})${emailSent ? ' [email sent]' : ' [email pending]'}`)

    return NextResponse.json(
      { success: true, message: 'Message received successfully', emailSent },
      { status: 200 }
    )
  } catch (error) {
    console.error('[contact-messages] Error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
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
