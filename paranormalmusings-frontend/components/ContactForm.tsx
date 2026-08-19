'use client'

import { useState } from 'react'
import { ArrowRight } from './icons'

const subjects = ['A case I would like looked at', 'A question about an article', 'Speaking or media', 'Something else']

/**
 * Client-side only for now — it validates and acknowledges in place. Point
 * `submit` at an API route or a form service to actually deliver the message.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false)

  const field = 'w-full h-12 px-4 rounded-xl bg-paper border border-rule text-[14.5px] text-ink placeholder:text-muted outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-300/40 transition'

  if (sent) {
    return (
      <div className="rounded-2xl bg-paper border border-rule p-8 shadow-soft">
        <div className="grid place-items-center w-12 h-12 rounded-full bg-gold-100 text-gold-600">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 12.5 5 5L20 7" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-[24px] text-ink">Message received</h3>
        <p className="mt-2.5 text-[15px] leading-relaxed">
          Thank you for writing. Case enquiries are read personally and answered in the order they arrive — please allow
          a few days for a reply.
        </p>
        <button
          onClick={() => setSent(false)}
          className="link-arrow mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink transition"
        >
          Send another message
          <ArrowRight />
        </button>
      </div>
    )
  }

  return (
    <form
      className="rounded-2xl bg-paper border border-rule p-6 sm:p-8 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="label text-muted">
            Your name
          </label>
          <input id="name" name="name" required placeholder="Full name" className={`${field} mt-2.5`} />
        </div>
        <div>
          <label htmlFor="email" className="label text-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" className={`${field} mt-2.5`} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="subject" className="label text-muted">
          What is this about?
        </label>
        <select id="subject" name="subject" defaultValue={subjects[0]} className={`${field} mt-2.5`}>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="label text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me what happened, where, and when it started."
          className="w-full mt-2.5 p-4 rounded-xl bg-paper border border-rule text-[14.5px] leading-relaxed text-ink placeholder:text-muted outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-300/40 transition resize-y"
        />
      </div>

      <button
        type="submit"
        className="link-arrow mt-6 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
      >
        Send message
        <ArrowRight />
      </button>
      <p className="mt-3.5 text-[12.5px] text-muted">
        Nothing you write here is published. Case details stay between us unless you say otherwise.
      </p>
    </form>
  )
}
