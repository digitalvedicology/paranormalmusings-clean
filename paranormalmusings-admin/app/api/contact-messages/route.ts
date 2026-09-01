import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

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

/**
 * POST /api/contact-messages
 * Accept contact form submissions and store them to a JSON file.
 * Simple approach that doesn't require SMTP configuration.
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
    const message: ContactMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      message: body.message,
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
      status: body.status || 'new',
      createdAt: now,
    }

    const messages = await readMessages()
    messages.unshift(message)
    await writeMessages(messages)

    console.log(`[contact-messages] New message stored from ${body.name} (${body.email})`)

    return NextResponse.json(
      { success: true, message: 'Message stored successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[contact-messages] Error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to store message' },
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
