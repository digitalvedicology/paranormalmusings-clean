'use client'

import { Notice as NoticeBox } from './ui'
import type { Notice } from './useSave'

/**
 * The sticky footer every editor screen ends with.
 *
 * It stays in view while you scroll a long form, so the save button is never
 * somewhere below the fold — and it is where the result of the last save is
 * reported, rather than in a toast that vanishes before it is read.
 */
export default function SaveBar({
  dirty,
  pending,
  notice,
  onSave,
  onReset,
  saveLabel = 'Save changes',
  children,
}: {
  dirty: boolean
  pending: boolean
  notice: Notice | null
  onSave: () => void
  onReset?: () => void
  saveLabel?: string
  /** Extra controls — delete, preview — shown on the left. */
  children?: React.ReactNode
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      {notice ? (
        <div className="mb-3">
          <NoticeBox notice={notice} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">{children}</div>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-[12.5px] text-muted">
            {pending ? 'Saving…' : dirty ? 'Unsaved changes' : 'Everything saved'}
          </span>
          {onReset ? (
            <button type="button" className="btn-ghost btn-sm" onClick={onReset} disabled={!dirty || pending}>
              Discard
            </button>
          ) : null}
          <button type="button" className="btn-primary" onClick={onSave} disabled={!dirty || pending}>
            {pending ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
