/**
 * After a save, the public site is holding a cached copy of the old content.
 *
 * ISR would clear it on its own within the revalidate window, but waiting a
 * minute to see your own edit is the kind of thing that makes an admin feel
 * broken. So every successful write pings the site's revalidate hook and the
 * change is live immediately.
 *
 * The ping is best-effort by design: if the site is down, or the secret is not
 * configured yet, the save has still succeeded and the reason is reported back
 * to the UI as a note rather than an error.
 */

export type RevalidateResult = { ok: boolean; detail: string }

export async function pingSite(): Promise<RevalidateResult> {
  const site = process.env.SITE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!site || !secret) {
    return { ok: false, detail: 'Saved. Set SITE_URL and REVALIDATE_SECRET to refresh the site instantly.' }
  }

  try {
    const response = await fetch(`${site.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      // Never let a hanging site hold a save open.
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
    })

    if (!response.ok) {
      return { ok: false, detail: `Saved, but the site returned ${response.status} when asked to refresh.` }
    }

    return { ok: true, detail: 'Saved and the site has been refreshed.' }
  } catch {
    return { ok: false, detail: 'Saved, but the site could not be reached to refresh it.' }
  }
}

/**
 * What a route returns after a successful write: the note to show, and whether
 * the site actually refreshed. The two are separate because a save can succeed
 * while the refresh fails, and reporting that as an unqualified success is how
 * a stale site goes unnoticed.
 */
export async function saved(): Promise<{ note: string; refreshed: boolean }> {
  const result = await pingSite()
  return { note: result.detail, refreshed: result.ok }
}
