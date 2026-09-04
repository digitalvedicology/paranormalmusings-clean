'use client'

import { useState } from 'react'
import ImageField from './ImageField'
import { Field, Input, Select, Textarea } from './ui'
import { BLOCK_TYPES, type Block, type BlockType } from '@/lib/types'

/**
 * The article body editor.
 *
 * Bodies are structured blocks rather than rich text, because the site's layout
 * derives real behaviour from that structure: an `h2` opens a new section and
 * earns an anchor, `tone: 'note'` renders a section as a set-apart advisory
 * panel, and a `list` gets the design's own bullet rhythm. A WYSIWYG box would
 * throw all of that away and hand back a blob of HTML the layout cannot reason
 * about — so each block is edited as what it is.
 */

const TYPE_LABELS: Record<BlockType, string> = {
  h2: 'Section heading',
  h3: 'Sub-heading',
  p: 'Paragraph',
  quote: 'Pull quote',
  list: 'Bulleted list',
  image: 'Picture',
}

const blank = (type: BlockType): Block => {
  if (type === 'list') return { type: 'list', items: [''] }
  if (type === 'image') return { type: 'image', src: '', alt: '' }
  return { type, text: '' } as Block
}

/** Rewrites a block to a new type, carrying the text across where it makes sense. */
function retype(block: Block, type: BlockType): Block {
  if (block.type === type) return block

  // An image carries no prose, so its caption is the nearest thing to text.
  const text =
    block.type === 'list' ? block.items.join(' ') : block.type === 'image' ? (block.caption ?? '') : block.text

  if (type === 'image') return { type: 'image', src: '', alt: '', ...(text ? { caption: text } : {}) }
  if (type === 'list') return { type: 'list', items: text ? [text] : [''] }
  if (type === 'h2') return { type: 'h2', text }
  return { type, text } as Block
}

export default function BlockEditor({
  body,
  onChange,
  siteUrl,
}: {
  body: Block[]
  onChange: (next: Block[]) => void
  /** Passed through to the picture control, which previews from the site. */
  siteUrl: string
}) {
  const [adding, setAdding] = useState<BlockType>('p')

  const replace = (index: number, next: Block) => onChange(body.map((block, i) => (i === index ? next : block)))
  const remove = (index: number) => onChange(body.filter((_, i) => i !== index))

  const move = (index: number, by: -1 | 1) => {
    const target = index + by
    if (target < 0 || target >= body.length) return
    const next = [...body]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  /** Inserts after `index` so a block can be added in the middle, not only at the end. */
  const insertAfter = (index: number, type: BlockType) => {
    const next = [...body]
    next.splice(index + 1, 0, blank(type))
    onChange(next)
  }

  const sections = body.filter((block) => block.type === 'h2').length
  const pictures = body.filter((block) => block.type === 'image').length

  /** The prose in a block, if it has any — a picture contributes none. */
  const prose = (block: Block) => {
    if (block.type === 'list') return block.items.join(' ')
    if (block.type === 'image') return block.caption ?? ''
    return block.text
  }

  const words = body.reduce(
    (total, block) => total + prose(block).trim().split(/\s+/).filter(Boolean).length,
    0,
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted">
        <span>
          <strong className="font-semibold text-ink">{body.length}</strong> block{body.length === 1 ? '' : 's'}
        </span>
        <span>
          <strong className="font-semibold text-ink">{sections}</strong> section{sections === 1 ? '' : 's'}
        </span>
        {pictures ? (
          <span>
            <strong className="font-semibold text-ink">{pictures}</strong> picture{pictures === 1 ? '' : 's'}
          </span>
        ) : null}
        <span>
          <strong className="font-semibold text-ink">{words}</strong> words
        </span>
        <span className="text-muted/80">≈ {Math.max(1, Math.round(words / 220))} min read</span>
      </div>

      {body.length === 0 ? (
        <p className="rounded-lg bg-mist px-3.5 py-3 text-[13px] text-muted">
          No body yet. A post without one still appears in listings, flagged &ldquo;Coming soon&rdquo;, and links to its
          section rather than to an empty article.
        </p>
      ) : null}

      {body.map((block, index) => (
        <div
          key={index}
          className={`rounded-lg border p-3.5 ${
            block.type === 'h2' ? 'border-gold-300 bg-gold-50/60' : 'border-rule bg-paper'
          }`}
        >
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select
                className="w-[168px] py-1.5 text-[12.5px]"
                value={block.type}
                onChange={(event) => replace(index, retype(block, event.target.value as BlockType))}
                options={BLOCK_TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type] }))}
              />

              {block.type === 'h2' ? (
                <label className="flex items-center gap-1.5 text-[12.5px] text-body">
                  <input
                    type="checkbox"
                    className="accent-gold-600"
                    checked={block.tone === 'note'}
                    onChange={(event) =>
                      replace(index, event.target.checked ? { ...block, tone: 'note' } : { type: 'h2', text: block.text })
                    }
                  />
                  Advisory panel
                </label>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <button type="button" className="btn-ghost btn-sm" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => move(index, 1)}
                disabled={index === body.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" className="btn-danger btn-sm" onClick={() => remove(index)} aria-label="Remove block">
                ✕
              </button>
            </div>
          </div>

          {block.type === 'list' ? (
            <ListItems items={block.items} onChange={(items) => replace(index, { type: 'list', items })} />
          ) : block.type === 'image' ? (
            <div className="space-y-3">
              <ImageField
                label="Picture"
                value={block.src}
                onChange={(src) => replace(index, { ...block, src })}
                siteUrl={siteUrl}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Describe it"
                  hint="Read aloud in place of the picture. Leave empty only if it is purely decorative."
                >
                  <Input
                    value={block.alt}
                    placeholder="A figure in a lit doorway"
                    onChange={(event) => replace(index, { ...block, alt: event.target.value })}
                  />
                </Field>
                <Field label="Caption" hint="Optional. Printed under the picture.">
                  <Input
                    value={block.caption ?? ''}
                    onChange={(event) => replace(index, { ...block, caption: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ) : (
            <Textarea
              rows={block.type === 'p' ? 4 : 2}
              value={block.text}
              placeholder={TYPE_LABELS[block.type]}
              onChange={(event) => replace(index, { ...block, text: event.target.value } as Block)}
              className={block.type === 'h2' || block.type === 'h3' ? 'font-display text-[16px]' : ''}
            />
          )}

          {/* Inserting in place is how a body actually gets written — a picture
              usually belongs between two particular paragraphs, not at the end. */}
          <div className="mt-2 flex justify-end gap-4">
            <button
              type="button"
              className="text-[12px] font-semibold text-muted hover:text-gold-600"
              onClick={() => insertAfter(index, 'p')}
            >
              + Insert paragraph below
            </button>
            <button
              type="button"
              className="text-[12px] font-semibold text-muted hover:text-gold-600"
              onClick={() => insertAfter(index, 'image')}
            >
              + Insert picture below
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 border-t border-rule pt-3">
        <Select
          className="w-[168px]"
          value={adding}
          onChange={(event) => setAdding(event.target.value as BlockType)}
          options={BLOCK_TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type] }))}
        />
        <button type="button" className="btn-ghost btn-sm" onClick={() => onChange([...body, blank(adding)])}>
          + Add block
        </button>
      </div>
    </div>
  )
}

function ListItems({ items, onChange }: { items: string[]; onChange: (next: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="mt-2.5 text-muted">•</span>
          <Textarea
            rows={1}
            value={item}
            placeholder="List item"
            onChange={(event) => onChange(items.map((entry, i) => (i === index ? event.target.value : entry)))}
          />
          <button
            type="button"
            className="btn-danger btn-sm mt-0.5"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost btn-sm" onClick={() => onChange([...items, ''])}>
        + Add item
      </button>
    </div>
  )
}
