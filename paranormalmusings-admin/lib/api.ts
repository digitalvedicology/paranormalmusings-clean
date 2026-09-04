import { cookies } from 'next/headers'
import { authorise } from './auth'
import { Invalid } from './validate'

/**
 * The plumbing every route handler shares: one authorisation check, one error
 * shape, and one place that decides what a failure looks like on the wire.
 *
 * Errors always come back as `{ error, problems? }` so the admin's forms can
 * render a validation failure field by field without special-casing each route.
 */

export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    // Content is served fresh; the frontend does its own ISR caching.
    headers: { 'cache-control': 'no-store' },
  })

export const fail = (error: string, status: number, problems?: string[]) =>
  json(problems ? { error, problems } : { error }, status)

/** Thrown by `requireAuth`; turned into a 401 by `handle`. */
class Unauthorised extends Error {}

export async function requireAuth(request: Request): Promise<void> {
  const store = await cookies()
  if (!authorise(request, store.get('pm_admin')?.value)) {
    throw new Unauthorised('Sign in or send a valid x-api-key header')
  }
}

/** Parses a JSON body, turning malformed input into a 400 rather than a 500. */
export async function body(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new Invalid(['Request body must be valid JSON'])
  }
}

/**
 * Wraps a handler so validation failures, auth failures and unexpected errors
 * all leave through the same door.
 */
export async function handle(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run()
  } catch (error) {
    if (error instanceof Unauthorised) return fail('Not authorised', 401)
    if (error instanceof Invalid) return fail('That did not validate', 422, error.problems)

    console.error('[api]', error)
    return fail('Something went wrong saving that', 500)
  }
}
