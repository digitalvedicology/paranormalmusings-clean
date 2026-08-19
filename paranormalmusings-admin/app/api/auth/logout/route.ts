import { COOKIE } from '@/lib/auth'
import { handle, json } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function POST() {
  return handle(async () => {
    const response = json({ ok: true })
    response.headers.append('set-cookie', `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`)
    return response
  })
}
