import { mintToken, passwordIsCorrect, sessionCookie } from '@/lib/auth'
import { body, fail, handle, json } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return handle(async () => {
    const { password } = ((await body(request)) ?? {}) as { password?: unknown }

    if (typeof password !== 'string' || !passwordIsCorrect(password)) {
      // Deliberately vague: a wrong password and an unconfigured admin look
      // the same from outside.
      return fail('That password is not right', 401)
    }

    const response = json({ ok: true })
    const cookie = sessionCookie(mintToken(), 7 * 24 * 60 * 60)
    response.headers.append(
      'set-cookie',
      `${cookie.name}=${cookie.value}; Path=${cookie.path}; Max-Age=${cookie.maxAge}; HttpOnly; SameSite=Lax${
        cookie.secure ? '; Secure' : ''
      }`,
    )
    return response
  })
}
