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
    } catch {
      setFormState({
        status: 'error',
        message: 'Failed to send message. Please try again.',
      })
    }
  }

  const field = 'w-full px-4 py-3 rounded-lg border border-divider bg-paper text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed'

  if (formState.status === 'success') {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 12.5 5 5L20 7" />
          </svg>
        </div>
        <h3 className="font-display text-[28px] text-ink mb-2">Message received!</h3>
        <p className="text-[15px] leading-relaxed text-body/85 max-w-md mx-auto mb-6">
          Thank you for reaching out. I read every message and will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setFormState({ status: 'idle' })}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-ink text-paper font-semibold text-[14px] hover:opacity-90 transition"
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
      className="w-full max-w-2xl mx-auto rounded-2xl bg-paper border border-divider p-8 sm:p-12 shadow-soft"
    >
      {/* Error message */}
      {formState.status === 'error' && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-800 text-[14px] font-semibold">{formState.message}</p>
              {formState.retryAfter && (
                <p className="text-red-700 text-[13px] mt-1">
                  Please wait {Math.ceil(formState.retryAfter / 60)} minute{Math.ceil(formState.retryAfter / 60) > 1 ? 's' : ''} before trying again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Name and Email */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contact-name" className="block text-[14px] font-semibold text-ink mb-2">
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
            <label htmlFor="contact-email" className="block text-[14px] font-semibold text-ink mb-2">
              Email address
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
        <div>
          <label htmlFor="contact-message" className="block text-[14px] font-semibold text-ink mb-2">
            Your message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={7}
            placeholder="Tell me what's on your mind..."
            disabled={formState.status === 'loading'}
            className={`${field} resize-none`}
          />
          <p className="mt-2 text-[12px] text-muted">10–5000 characters</p>
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
          <div className="flex justify-center">
            <div ref={turnstileRef} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formState.status === 'loading'}
          className="w-full h-13 px-8 rounded-lg bg-gold-500 text-white text-[15px] font-semibold hover:bg-gold-600 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {formState.status === 'loading' ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Send message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>

        {/* Privacy notice */}
        <p className="text-[13px] leading-relaxed text-muted/85">
          Your privacy matters. We only use your information to respond to your message. Your data is protected under the{' '}
          <Link href="/privacy" className="text-ink font-medium hover:underline">
            Privacy Policy
          </Link>
          {' '}(India DPDP Act 2023 &amp; GDPR compliant).
        </p>
      </div>
    </form>
  )
}
