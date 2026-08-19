'use client'

/**
 * A list of rows you can add to, remove from and reorder.
 *
 * Order is meaningful almost everywhere in this content — nav links, hub
 * clusters, the home page's curated slots — so moving a row up or down is a
 * first-class control rather than something you achieve by retyping.
 *
 * Reordering is by button, not drag: it works from the keyboard, needs no
 * pointer precision, and there is never a row count here big enough for
 * dragging to be the faster option.
 */
export default function Repeatable<T>({
  items,
  onChange,
  create,
  render,
  addLabel = 'Add',
  empty = 'Nothing here yet.',
  rowLabel,
}: {
  items: T[]
  onChange: (next: T[]) => void
  /** Builds a blank row. */
  create: () => T
  /** Renders one row's fields; `set` replaces that row. */
  render: (item: T, set: (next: T) => void, index: number) => React.ReactNode
  addLabel?: string
  empty?: string
  /** Heading shown above each row, e.g. "Cluster 2". */
  rowLabel?: (item: T, index: number) => string
}) {
  const replace = (index: number, next: T) => onChange(items.map((item, i) => (i === index ? next : item)))

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index))

  const move = (index: number, by: -1 | 1) => {
    const target = index + by
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? <p className="rounded-lg bg-mist px-3.5 py-3 text-[13px] text-muted">{empty}</p> : null}

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-rule bg-mist/40 p-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="label">{rowLabel ? rowLabel(item, index) : `${index + 1}`}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => remove(index)}
                aria-label="Remove"
                title="Remove"
              >
                Remove
              </button>
            </div>
          </div>

          {render(item, (next) => replace(index, next), index)}
        </div>
      ))}

      <button type="button" className="btn-ghost btn-sm" onClick={() => onChange([...items, create()])}>
        + {addLabel}
      </button>
    </div>
  )
}
