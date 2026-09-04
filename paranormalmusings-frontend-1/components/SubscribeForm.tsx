'use client'

import { useState } from 'react'
import { ArrowRight } from './icons'

/**
 * Three dressings of the same form — the banded one in the newsletter section,
 * the inline pill in the footer, and the stacked opt-in in the article sidebar.
 * Submits to /api/newsletter for storage in Payload CMS database.
 */
export default function SubscribeForm({ variant = 'banner' }: { variant?: 'banner' | 'inline' | 'sidebar' }) {
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const name = formData.get('name') as string | null

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name?.trim() || '',
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        error?: string
        message?: string
      }

      if (data.success) {
        setDone(true)
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again later.')
      console.error('[newsletter] Submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'sidebar') {
    return (
      <form className="mt-4 grid gap-2.5" onSubmit={submit}>
        <input
          type="text"
          name="name"
          placeholder="First name"
          aria-label="First name"
          className="h-11 px-4 rounded-xl bg-white/[0.06] border border-white/12 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-gold-300/60 transition"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          className="h-11 px-4 rounded-xl bg-white/[0.06] border border-white/12 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-gold-300/60 transition disabled:opacity-50"
          disabled={loading}
        />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        <button
          type="submit"
          className="h-11 rounded-xl bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition disabled:opacity-50"
          disabled={loading || done}
        >
          {done ? 'You are on the list' : loading ? 'Subscribing...' : 'Subscribe'}
        </button>
        <p className="mt-1 text-[12px] text-white/40">No spam. Unsubscribe anytime.</p>
      </form>
    )
  }

  if (variant === 'inline') {
    return (
      <form className="mt-6" onSubmit={submit}>
        <label htmlFor="footer-email" className="label text-white/40">
          Subscribe to our newsletter
        </label>
        <div className="mt-3 flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 pl-4 pr-1.5 py-1.5">
          <input
            id="footer-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="flex-1 h-9 bg-transparent text-[14px] text-white placeholder:text-white/35 outline-none disabled:opacity-50"
            disabled={loading}
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="grid place-items-center w-9 h-9 rounded-full bg-gold-500 hover:bg-gold-600 transition disabled:opacity-50"
            disabled={loading || done}
          >
            <ArrowRight />
          </button>
        </div>
        {error && <p className="mt-2.5 text-[12.5px] text-red-400">{error}</p>}
        {done && <p className="mt-2.5 text-[12.5px] text-gold-300">Thank you — you are on the list.</p>}
      </form>
    )
  }

  return (
    <>
      <form className="mt-4 flex flex-col sm:flex-row gap-2.5 max-w-lg" onSubmit={submit}>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          aria-label="Email address"
          className="flex-1 h-12 px-4 rounded-full bg-paper border border-white/70 text-[14.5px] text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-gold-300 disabled:opacity-50"
          disabled={loading}
        />
        <button
          type="submit"
          className="link-arrow inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-ink text-white text-[14px] font-semibold hover:bg-night-700 transition disabled:opacity-50"
          disabled={loading || done}
        >
          {loading ? 'Joining...' : 'Join the list'}
          {!loading && <ArrowRight />}
        </button>
      </form>
      <p className="mt-3 text-[12.5px] text-body/70">
        {error && <span className="font-semibold text-red-500">{error}</span>}
        {done ? (
          <span className="font-semibold text-ink">Thank you — you are on the list.</span>
        ) : !error ? (
          <>
            Free to join <span className="opacity-40">•</span> Unsubscribe anytime
          </>
        ) : null}
      </p>
    </>
  )
}
