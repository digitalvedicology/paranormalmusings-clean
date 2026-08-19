'use client'

export type PostOption = { slug: string; title: string; category?: string; status?: string }

/**
 * Posts are referenced by slug all over the document — the home page bands, the
 * footer's popular list, a hub's pillar and clusters. Typing a slug by hand is
 * how those lists end up pointing at posts that do not exist, so every
 * reference is chosen from the real set instead.
 */

export function SlugSelect({
  value,
  options,
  onChange,
  allowEmpty = true,
  emptyLabel = '— none —',
}: {
  value: string
  options: PostOption[]
  onChange: (next: string) => void
  allowEmpty?: boolean
  emptyLabel?: string
}) {
  // A slug saved before the post was deleted would otherwise vanish silently
  // from the select; surface it so it can be seen and corrected.
  const orphan = value && !options.some((option) => option.slug === value)

  return (
    <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
      {allowEmpty ? <option value="">{emptyLabel}</option> : null}
      {orphan ? <option value={value}>⚠ {value} (missing)</option> : null}
      {options.map((option) => (
        <option key={option.slug} value={option.slug}>
          {option.status === 'draft' ? '◦ ' : ''}
          {option.title}
        </option>
      ))}
    </select>
  )
}

/** An ordered list of slugs — order is what the site renders, so it is editable. */
export function SlugList({
  value,
  options,
  onChange,
  hint,
}: {
  value: string[]
  options: PostOption[]
  onChange: (next: string[]) => void
  hint?: string
}) {
  const bySlug = new Map(options.map((option) => [option.slug, option]))
  const unused = options.filter((option) => !value.includes(option.slug))

  const move = (index: number, by: -1 | 1) => {
    const target = index + by
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {value.length === 0 ? (
        <p className="rounded-lg bg-mist px-3 py-2.5 text-[13px] text-muted">No posts chosen yet.</p>
      ) : null}

      <ol className="space-y-1.5">
        {value.map((slug, index) => {
          const post = bySlug.get(slug)
          return (
            <li key={`${slug}-${index}`} className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2">
              <span className="w-5 shrink-0 text-[12px] font-semibold text-muted">{index + 1}</span>
              <span className={`min-w-0 flex-1 truncate text-[13.5px] ${post ? 'text-ink' : 'text-red-700'}`}>
                {post ? post.title : `⚠ ${slug} — no such post`}
              </span>
              <button type="button" className="btn-ghost btn-sm" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove"
              >
                ✕
              </button>
            </li>
          )
        })}
      </ol>

      <select
        className="field"
        value=""
        onChange={(event) => {
          if (event.target.value) onChange([...value, event.target.value])
        }}
        disabled={unused.length === 0}
      >
        <option value="">{unused.length ? '+ Add a post…' : 'Every post is already in this list'}</option>
        {unused.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.status === 'draft' ? '◦ ' : ''}
            {option.title}
          </option>
        ))}
      </select>

      {hint ? <p className="text-[12.5px] text-muted">{hint}</p> : null}
    </div>
  )
}
