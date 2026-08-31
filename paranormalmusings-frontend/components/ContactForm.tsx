'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
  retryAfter?: number
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: object) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string
    }
  }
}

/**
 * Contact form with spam protection (honeypot, rate limiting, Turnstile),
 * email delivery via Resend, and storage in Payload CMS.
 *
 * Server-side handler ensures email address and API keys never leak to browser.
 */
export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ status: 'idle' })
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)

  // Load Turnstile script and render widget
  useEffect(() => {
    if (!window.turnstile) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const checkTurnstile = setInterval(() => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId) {
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY || '',
            theme: 'light',
            size: 'normal',
          })
          setTurnstileWidgetId(widgetId)
        } catch (error) {
          console.error('Failed to render Turnstile:', error)
        }
        clearInterval(checkTurnstile)
      }
    }, 100)

    return () => clearInterval(checkTurnstile)
  }, [turnstileWidgetId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState({ status: 'loading' })

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const turnstileToken = turnstileWidgetId ? window.turnstile?.getResponse(turnstileWidgetId) : ''

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          honeypot: formData.get('honeypot'),
          'cf-turnstile-response': turnstileToken,
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        message?: string
        error?: string
        retryAfter?: number
      }

      if (data.success) {
        setFormState({ status: 'success', message: data.message })
        formRef.current.reset()

        // Reset Turnstile
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId)
        }

        // Clear success message after 8 seconds
        setTimeout(() => {
          setFormState({ status: 'idle' })
        }, 8000)
      } else {
        setFormState({
          status: 'error',
          message: data.error,
          retryAfter: data.retryAfter,
        })
      }
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'Failed to send message. Please try again.',
      })
    }
  }

  const field = 'w-full px-4 py-2.5 rounded-lg border border-divider text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 transition disabled:opacity-50'

  if (formState.status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8">
        <div className="grid place-items-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-5">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 12.5 5 5L20 7" />
          </svg>
        </div>
        <h3 className="font-display text-[24px] text-ink">Message received</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          Thank you for writing. We read everything but cannot reply to every message. Your inquiry has been recorded.
        </p>
        <button
          onClick={() => setFormState({ status: 'idle' })}
          className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink hover:opacity-70 transition"
        >
          Send another message
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl bg-paper border border-divider p-6 sm:p-8 shadow-soft"
    >
      {/* Error message */}
      {formState.status === 'error' && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-800 text-[14px] font-medium">{formState.message}</p>
          {formState.retryAfter && (
            <p className="text-red-700 text-[12px] mt-2">
              Please wait {Math.ceil(formState.retryAfter / 60)} minutes before trying again.
            </p>
          )}
        </div>
      )}

      {/* Name and Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-[14px] font-medium text-ink mb-2">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Full name"
            disabled={formState.status === 'loading'}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-[14px] font-medium text-ink mb-2">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            disabled={formState.status === 'loading'}
            className={field}
          />
        </div>
      </div>

      {/* Message */}
      <div className="mt-4">
        <label htmlFor="contact-message" className="block text-[14px] font-medium text-ink mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell me what's on your mind..."
          disabled={formState.status === 'loading'}
          className={`${field} resize-y`}
        />
        <p className="mt-1 text-[12px] text-muted">10–5000 characters</p>
      </div>

      {/* Honeypot field (hidden from real users) */}
      <input
        name="honeypot"
        type="text"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Turnstile Widget */}
      {process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_KEY && (
        <div className="mt-4 flex justify-center">
          <div ref={turnstileRef} />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formState.status === 'loading' || formState.status === 'success'}
        className="mt-6 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
      >
        {formState.status === 'loading' ? 'Sending...' : 'Send message'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Privacy notice */}
      <p className="mt-4 text-[12px] leading-relaxed text-muted">
        Nothing you write here is published. We collect your name and email to respond to your message. Your data is protected under the{' '}
        <Link href="/" className="text-ink hover:underline">
          Privacy Policy
        </Link>{' '}
        (India DPDP Act 2023 &amp; GDPR compliant).
      </p>
    </form>
  )
}
