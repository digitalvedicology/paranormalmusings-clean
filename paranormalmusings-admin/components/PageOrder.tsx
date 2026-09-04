'use client'

import { useState } from 'react'
import SaveBar from './SaveBar'
import { Section } from './ui'
import { useSave } from './useSave'

/**
 * The order of the pages *is* the order they appear in — in the menu, the
 * footer, the "four ways in" band and every category listing. So it gets its
 * own small editor rather than being buried as a number on each page.
 */
export default function PageOrder({ pages }: { pages: { key: string; label: string }[] }) {
  const { pending, notice, send } = useSave()
  const [order, setOrder] = useState(pages)

  const dirty = order.map((page) => page.key).join() !== pages.map((page) => page.key).join()

  const move = (index: number, by: -1 | 1) => {
    const target = index + by
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
  }

  return (
    <Section title="Order" description="The sequence these pages appear in across the site.">
      <ol className="space-y-1.5">
        {order.map((page, index) => (
          <li key={page.key} className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2">
            <span className="w-5 text-[12px] font-semibold text-muted">{index + 1}</span>
            <span className="flex-1 text-[14px] text-ink">{page.label}</span>
            <button type="button" className="btn-ghost btn-sm" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
              ↑
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => move(index, 1)}
              disabled={index === order.length - 1}
              aria-label="Move down"
            >
              ↓
            </button>
          </li>
        ))}
      </ol>

      <SaveBar
        dirty={dirty}
        pending={pending}
        notice={notice}
        onReset={() => setOrder(pages)}
        onSave={() => send('/api/categories', { method: 'PUT', payload: { order: order.map((page) => page.key) } })}
      />
    </Section>
  )
}
