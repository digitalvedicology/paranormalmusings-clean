'use client'

import { useId } from 'react'

/**
 * The handful of primitives every editing screen is built from.
 *
 * Deliberately unclever: each is a thin wrapper that owns its label, its hint
 * and its spacing, so a form is a readable list of fields rather than a wall of
 * class names. Anything more elaborate than this belongs in its own component.
 */

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{hint}</p> : null}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input {...rest} className={`field ${className}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', rows = 3, ...rest } = props
  return <textarea {...rest} rows={rows} className={`field ${className}`} />
}

export function Select({
  options,
  className = '',
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select {...rest} className={`field ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

/** A switch rather than a checkbox — publish state deserves to read as a state. */
export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  hint?: string
}) {
  const id = useId()

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked ? 'border-gold-600 bg-gold-600' : 'border-rule bg-mist'
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-paper shadow-soft transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-[14px] font-semibold text-ink">{label}</span>
        {hint ? <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{hint}</span> : null}
      </label>
    </div>
  )
}

/** A titled group of fields. Sections are how a long form stays scannable. */
export function Section({
  title,
  description,
  children,
  aside,
}: {
  title: string
  description?: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[19px] text-ink">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">{description}</p> : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Pill({ status }: { status: 'published' | 'draft' | string }) {
  if (status === 'published') return <span className="pill-live">● Live</span>
  if (status === 'draft') return <span className="pill-draft">● Draft</span>
  return <span className="pill-muted">{status}</span>
}

/** Inline result of the last save — success note or the validation problems. */
export function Notice({
  notice,
}: {
  notice: { kind: 'ok' | 'warn' | 'error'; text: string; problems?: string[] } | null
}) {
  if (!notice) return null

  // Three states, because a save can succeed while the site fails to refresh —
  // and that is neither a success nor a failure to save.
  const tone = {
    ok: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-800',
  }[notice.kind]

  return (
    <div role="status" className={`rounded-lg border px-3.5 py-2.5 text-[13px] ${tone}`}>
      <p className="font-semibold">{notice.text}</p>
      {notice.problems?.length ? (
        <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
          {notice.problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
