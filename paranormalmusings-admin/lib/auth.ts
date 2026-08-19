import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * One shared password guards the whole admin.
 *
 * The password itself is never stored in the cookie. Signing in mints an
 * HMAC-signed token carrying only an expiry, so the cookie cannot be replayed
 * past its window and cannot be forged without ADMIN_PASSWORD. That keeps the
 * whole thing to two env vars and no user table, which is the trade this
 * project asked for — if more than one person ever needs an account, replace
 * this file with real sessions and nothing else has to move.
 */

export const COOKIE = 'pm_admin'
const DAY = 24 * 60 * 60 * 1000
const TTL = 7 * DAY

const password = () => process.env.ADMIN_PASSWORD ?? ''
const apiKey = () => process.env.ADMIN_API_KEY ?? ''

/** Length-independent constant-time compare. */
function safeEqual(a: string, b: string): boolean {
  const left = createHmac('sha256', 'compare').update(a).digest()
  const right = createHmac('sha256', 'compare').update(b).digest()
  return timingSafeEqual(left, right)
}

function sign(expiry: number): string {
  return createHmac('sha256', password()).update(String(expiry)).digest('hex')
}

export function mintToken(): string {
  const expiry = Date.now() + TTL
  return `${expiry}.${sign(expiry)}`
}

export function tokenIsValid(token: string | undefined): boolean {
  if (!token || !password()) return false

  const [rawExpiry, signature] = token.split('.')
  const expiry = Number(rawExpiry)
  if (!Number.isFinite(expiry) || !signature) return false
  if (expiry < Date.now()) return false

  return safeEqual(signature, sign(expiry))
}

export function passwordIsCorrect(candidate: string): boolean {
  const expected = password()
  // An unset password locks the admin rather than opening it.
  if (!expected) return false
  return safeEqual(candidate, expected)
}

/** True when the caller holds a valid session cookie. For pages and layouts. */
export async function isSignedIn(): Promise<boolean> {
  const store = await cookies()
  return tokenIsValid(store.get(COOKIE)?.value)
}

export const sessionCookie = (value: string, maxAge: number) => ({
  name: COOKIE,
  value,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge,
})

/**
 * Authorises a write. Accepts either the browser session cookie (the admin UI)
 * or an `x-api-key` header matching ADMIN_API_KEY (scripts and the frontend).
 */
export function authorise(request: Request, cookieValue: string | undefined): boolean {
  if (tokenIsValid(cookieValue)) return true

  const key = request.headers.get('x-api-key')
  const expected = apiKey()
  return Boolean(key && expected && safeEqual(key, expected))
}

/** Whether the admin has been configured at all — surfaced as a setup warning. */
export const isConfigured = () => Boolean(password())
