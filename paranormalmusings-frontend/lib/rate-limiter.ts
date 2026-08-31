/**
 * Simple in-memory rate limiter for contact form submissions.
 * Tracks IP/identifier and enforces limit per time window.
 *
 * For production with multiple instances, upgrade to Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 3600000, maxRequests: number = 5) {
    // Default: 5 requests per hour
    this.windowMs = windowMs
    this.maxRequests = maxRequests

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 300000)
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.storage.get(identifier)

    if (!entry || now > entry.resetAt) {
      // First request or window expired
      this.storage.set(identifier, { count: 1, resetAt: now + this.windowMs })
      return true
    }

    if (entry.count < this.maxRequests) {
      entry.count++
      return true
    }

    return false
  }

  getRemainingTime(identifier: string): number {
    const entry = this.storage.get(identifier)
    if (!entry) return 0

    const remaining = entry.resetAt - Date.now()
    return Math.max(0, remaining)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetAt) {
        this.storage.delete(key)
      }
    }
  }
}

export const contactFormLimiter = new RateLimiter(3600000, 5) // 5 per hour
