import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-dynamic'

const DATA_DIR = process.env.DATA_DIR?.trim() || path.join(process.cwd(), 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'newsletter-subscribers.json')

interface NewsletterSubscriber {
  id: string
  email: string
  name: string
  status: 'subscribed' | 'unsubscribed'
  ipAddress: string
  userAgent?: string
  subscribedAt: string
  unsubscribedAt?: string
}

async function readSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8')
    return JSON.parse(data) as NewsletterSubscriber[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function writeSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf8')
}

/**
 * GET /api/newsletter-subscribers
 * Retrieve all newsletter subscribers
 */
export async function GET(request: NextRequest) {
  try {
    const subscribers = await readSubscribers()
    return NextResponse.json(
      { success: true, data: subscribers, total: subscribers.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('[newsletter-subscribers] GET error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve subscribers' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/newsletter-subscribers
 * Add a new newsletter subscriber
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email: string
      name?: string
      ipAddress: string
      userAgent?: string
      status?: 'subscribed' | 'unsubscribed'
      subscribedAt?: string
    }

    // Validate email
    if (!body.email || !body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const subscribers = await readSubscribers()

    // Check if already subscribed
    const existing = subscribers.find(s => s.email.toLowerCase() === body.email.toLowerCase())
    if (existing && existing.status === 'subscribed') {
      return NextResponse.json(
        { success: false, error: 'Already subscribed' },
        { status: 409 }
      )
    }

    const now = new Date().toISOString()
    const subscriberId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const subscriber: NewsletterSubscriber = {
      id: subscriberId,
      email: body.email.toLowerCase(),
      name: body.name?.trim() || '',
      status: body.status || 'subscribed',
      ipAddress: body.ipAddress,
      userAgent: body.userAgent,
      subscribedAt: body.subscribedAt || now,
    }

    if (existing) {
      // Resubscribe existing subscriber
      const index = subscribers.findIndex(s => s.id === existing.id)
      subscribers[index] = subscriber
    } else {
      // Add new subscriber
      subscribers.unshift(subscriber)
    }

    await writeSubscribers(subscribers)

    console.log(`[newsletter-subscribers] New subscriber: ${body.email} (${body.name || 'no name'})`)

    return NextResponse.json(
      { success: true, message: 'Subscription successful', data: subscriber },
      { status: 200 }
    )
  } catch (error) {
    console.error('[newsletter-subscribers] POST error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/newsletter-subscribers
 * Update subscriber status (unsubscribe, etc)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      email: string
      status: 'subscribed' | 'unsubscribed'
    }

    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const subscribers = await readSubscribers()
    const index = subscribers.findIndex(s => s.email.toLowerCase() === body.email.toLowerCase())

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    subscribers[index].status = body.status
    if (body.status === 'unsubscribed') {
      subscribers[index].unsubscribedAt = new Date().toISOString()
    }

    await writeSubscribers(subscribers)

    console.log(`[newsletter-subscribers] Updated ${body.email} status to ${body.status}`)

    return NextResponse.json(
      { success: true, message: 'Status updated', data: subscribers[index] },
      { status: 200 }
    )
  } catch (error) {
    console.error('[newsletter-subscribers] PATCH error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/newsletter-subscribers
 * Delete a subscriber
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const subscribers = await readSubscribers()
    const filtered = subscribers.filter(s => s.email.toLowerCase() !== email.toLowerCase())

    if (filtered.length === subscribers.length) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    await writeSubscribers(filtered)

    console.log(`[newsletter-subscribers] Deleted ${email}`)

    return NextResponse.json(
      { success: true, message: 'Subscriber deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[newsletter-subscribers] DELETE error:', (error as Error).message)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
