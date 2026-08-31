import { notFound } from 'next/navigation'

/**
 * Catch-all route for any unmatched URLs.
 * Triggers the custom not-found.tsx page instead of Next.js default 404.
 *
 * This must be the LAST route in the app directory to avoid catching
 * valid routes. Routes are matched in order of specificity.
 */

export default function CatchAll() {
  notFound()
}
