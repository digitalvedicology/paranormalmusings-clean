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
      className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-paper to-paper/95 border border-divider/60 p-8 sm:p-12 shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Error message */}
      {formState.status === 'error' && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/70 backdrop-blur-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-red-900 text-[14px] font-semibold">{formState.message}</p>
              {formState.retryAfter && (
                <p className="text-red-800/75 text-[13px] mt-1.5">
                  Please wait {Math.ceil(formState.retryAfter / 60)} minute{Math.ceil(formState.retryAfter / 60) > 1 ? 's' : ''} before trying again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-7">
        {/* Form Header */}
        <div className="mb-8">
          <h3 className="font-display text-[26px] text-ink mb-2">Get in touch</h3>
          <p className="text-[15px] text-body/75">I'd love to hear from you. Send me a message and I'll respond as soon as possible.</p>
        </div>

        {/* Name and Email */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="group">
            <label htmlFor="contact-name" className="block text-[13px] font-semibold text-ink/90 mb-3 uppercase tracking-wide">
              Name
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                placeholder="John Doe"
                disabled={formState.status === 'loading'}
                className={`${field} pl-11`}
              />
            </div>
          </div>
          <div className="group">
            <label htmlFor="contact-email" className="block text-[13px] font-semibold text-ink/90 mb-3 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                disabled={formState.status === 'loading'}
                className={`${field} pl-11`}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label htmlFor="contact-message" className="block text-[13px] font-semibold text-ink/90 mb-3 uppercase tracking-wide">
            Message
          </label>
          <div className="relative">
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={7}
              placeholder="Share your thoughts, questions, or experiences..."
              disabled={formState.status === 'loading'}
              className={`${field} resize-none`}
            />
            <p className="mt-3 text-[12px] text-muted/70 flex justify-between">
              <span>10–5000 characters</span>
            </p>
          </div>
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
          className="w-full group relative h-13 px-8 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[15px] font-semibold overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:from-gold-600 hover:to-gold-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3">
            {formState.status === 'loading' ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send message</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
        </button>

        {/* Privacy notice */}
        <div className="p-4 rounded-xl bg-ink/3 border border-ink/10">
          <p className="text-[12px] leading-relaxed text-body/75">
            <span className="block font-medium text-ink/90 mb-1.5">🔒 Your privacy is protected</span>
            We only use your information to respond to your message. Your data is protected under the{' '}
            <Link href="/privacy" className="text-gold-600 font-medium hover:text-gold-700 transition">
              Privacy Policy
            </Link>
            {' '}(India DPDP Act 2023 &amp; GDPR compliant).
          </p>
        </div>
      </div>
    </form>
  )
}
