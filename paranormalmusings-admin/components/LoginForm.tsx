'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, Input, Notice } from './ui'

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    }).catch(() => null)

    if (!response?.ok) {
      const data = await response?.json().catch(() => ({}))
      setError(data?.error ?? 'Could not reach the server.')
      setPending(false)
      return
    }

    // The guard runs in a server layout, so the new cookie only takes effect
    // once the server re-renders — replace, then refresh, in that order.
    router.replace(next)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Password">
        <Input
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          aria-invalid={error ? 'true' : undefined}
        />
      </Field>

      {error ? <Notice notice={{ kind: 'error', text: error }} /> : null}

      <button type="submit" className="btn-primary w-full" disabled={pending || !password}>
        {pending ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  )
}
