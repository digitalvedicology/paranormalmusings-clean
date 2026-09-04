'use client'

import { useState } from 'react'
import { ArrowRight } from './icons'

/**
 * Client-side only — it validates and acknowledges in place. Point `submit` at
 * an API route or a comments service to actually store anything.
 */
export default function CommentForm() {
  const [sent, setSent] = useState(false)

  const field =
    'w-full h-12 px-4 rounded-xl bg-paper border border-rule text-[14.5px] text-ink placeholder:text-muted outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-300/40 transition'

  if (sent) {
    return (
      <div className="mt-6 rounded-2xl border border-rule bg-mist p-6">
        <p className="font-display text-[19px] text-ink">Thank you — your comment is awaiting review.</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Comments are read before they appear, so it may be a day or two before yours shows up.
        </p>
      </div>
    )
  }

  return (
    <form
      className="mt-6"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <label htmlFor="comment" className="label text-muted">
        Your comment
      </label>
      <textarea
        id="comment"
        name="comment"
        required
        rows={5}
        placeholder="Share your thoughts or your own experience…"
        className="w-full mt-2.5 p-4 rounded-xl bg-paper border border-rule text-[14.5px] leading-relaxed text-ink placeholder:text-muted outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-300/40 transition resize-y"
      />

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="comment-name" className="label text-muted">
            Name
          </label>
          <input id="comment-name" name="name" required placeholder="Your name" className={`${field} mt-2.5`} />
        </div>
        <div>
          <label htmlFor="comment-email" className="label text-muted">
            Email
          </label>
          <input
            id="comment-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={`${field} mt-2.5`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="link-arrow mt-5 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
      >
        Post comment
        <ArrowRight />
      </button>
      <p className="mt-3 text-[12.5px] text-muted">Your email is not published. Comments are reviewed before posting.</p>
    </form>
  )
}
