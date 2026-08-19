'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockEditor from './BlockEditor'
import ImageField from './ImageField'
import SaveBar from './SaveBar'
import { Field, Input, Section, Select, Textarea, Toggle } from './ui'
import { useSave } from './useSave'
import type { Post } from '@/lib/types'

type CategoryOption = { key: string; label: string; href: string }

/**
 * The article editor.
 *
 * One draft, one PATCH. Renaming the slug is allowed because the API repoints
 * every curated list that referenced the old one in the same write — so a post
 * can be renamed without quietly emptying a home page band.
 */
export default function PostForm({
  post,
  categories,
  siteUrl,
  mode = 'edit',
}: {
  post: Post
  categories: CategoryOption[]
  siteUrl: string
  mode?: 'edit' | 'create'
}) {
  const router = useRouter()
  const { pending, notice, setNotice, send } = useSave()
  const [draft, setDraft] = useState<Post>(post)
  const [slugLocked, setSlugLocked] = useState(mode === 'edit')

  const dirty = mode === 'create' || JSON.stringify(draft) !== JSON.stringify(post)
  const set = <K extends keyof Post>(key: K, value: Post[K]) => setDraft((current) => ({ ...current, [key]: value }))

  const category = categories.find((entry) => entry.key === draft.category)
  const liveHref = category ? `${siteUrl}${category.href}/${draft.slug}` : ''

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const onTitle = (value: string) => {
    set('title', value)
    // On a new post the slug tracks the title until it is edited directly.
    if (!slugLocked) set('slug', slugify(value))
  }

  async function save() {
    if (mode === 'create') {
      await send<{ post: { slug: string } }>('/api/posts', {
        method: 'POST',
        payload: draft,
        onDone: (data) => {
          router.replace(`/posts/${data.post.slug}`)
          router.refresh()
        },
      })
      return
    }

    await send<{ post: { slug: string } }>(`/api/posts/${post.slug}`, {
      payload: draft,
      onDone: (data) => {
        // The URL carries the slug, so a rename has to move the editor with it.
        if (data.post.slug !== post.slug) router.replace(`/posts/${data.post.slug}`)
      },
    })
  }

  async function remove() {
    if (!confirm(`Delete "${draft.title}"? This cannot be undone.`)) return

    const response = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setNotice({ kind: 'error', text: data.error ?? 'Could not delete that post' })
      return
    }

    router.replace('/posts')
    router.refresh()
  }

  const alsoIn = categories.filter((entry) => entry.key !== draft.category)

  return (
    <div className="space-y-6">
      <Section
        title="The piece"
        description="Its headline, where it is filed, and the summary that appears on every card linking to it."
        aside={
          mode === 'edit' && draft.body.length ? (
            <a href={liveHref} target="_blank" rel="noreferrer" className="btn-ghost btn-sm shrink-0">
              View ↗
            </a>
          ) : null
        }
      >
        <div className="space-y-4">
          <Toggle
            checked={draft.status === 'published'}
            onChange={(next) => set('status', next ? 'published' : 'draft')}
            label="Published"
            hint="Drafts are held back from the site entirely — they are not sent to it at all."
          />

          <Field label="Title">
            <Input value={draft.title} onChange={(event) => onTitle(event.target.value)} />
          </Field>

          <Field
            label="Address"
            hint={
              mode === 'edit'
                ? 'Changing this changes the article’s URL. Anywhere it is featured follows it automatically.'
                : 'Filled in from the title. Edit it if you want something shorter.'
            }
          >
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[12.5px] text-muted">{category?.href ?? ''}/</span>
              <Input
                value={draft.slug}
                onChange={(event) => {
                  setSlugLocked(true)
                  set('slug', slugify(event.target.value))
                }}
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Section" hint="The page this article lives under, and the first half of its address.">
              <Select
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    category: event.target.value,
                    // A post cannot be cross-filed into its own section.
                    alsoIn: current.alsoIn.filter((key) => key !== event.target.value),
                  }))
                }
                options={categories.map((entry) => ({ value: entry.key, label: entry.label }))}
              />
            </Field>

            <Field label="Sub-label" hint="Shown instead of the section name on cards — e.g. Equipment, Method.">
              <Input value={draft.kicker} onChange={(event) => set('kicker', event.target.value)} placeholder="Optional" />
            </Field>
          </div>

          <div>
            <p className="label mb-2">Also filed under</p>
            <div className="flex flex-wrap gap-2">
              {alsoIn.map((entry) => {
                const on = draft.alsoIn.includes(entry.key)
                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() =>
                      set('alsoIn', on ? draft.alsoIn.filter((key) => key !== entry.key) : [...draft.alsoIn, entry.key])
                    }
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      on ? 'border-gold-600 bg-gold-600 text-paper' : 'border-rule bg-paper text-body hover:border-bark-100'
                    }`}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[12.5px] text-muted">
              Cross-filed posts appear in these sections too, but keep the address above.
            </p>
          </div>

          <Field label="Excerpt" hint="The summary under the headline on cards and in listings.">
            <Textarea rows={3} value={draft.excerpt} onChange={(event) => set('excerpt', event.target.value)} />
          </Field>

          <Field label="Standfirst" hint="The opening paragraph on the article page itself, set larger than the body.">
            <Textarea rows={3} value={draft.dek} onChange={(event) => set('dek', event.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Photograph" description="Used everywhere this piece appears — cards, listings, and the top of the article itself.">
        <div className="space-y-4">
          <ImageField
            label="Featured image"
            value={draft.image}
            onChange={(image) => set('image', image)}
            siteUrl={siteUrl}
            hint="Landscape reads best, roughly 1600×900 or larger. The site's own grade is applied on top, so upload the plain original."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Where it appears"
              hint={
                draft.imagePlacement === 'lead'
                  ? 'Full width above the headline, so the picture opens the piece.'
                  : draft.imagePlacement === 'hidden'
                    ? 'Not on the article page. Still used on cards and in listings.'
                    : 'Under the byline row, between the standfirst and the first paragraph.'
              }
            >
              <Select
                value={draft.imagePlacement}
                onChange={(event) => set('imagePlacement', event.target.value as Post['imagePlacement'])}
                options={[
                  { value: 'lead', label: 'Above the headline' },
                  { value: 'standard', label: 'Under the byline' },
                  { value: 'hidden', label: 'Not on the article' },
                ]}
              />
            </Field>

            <Field
              label="Placeholder seed"
              hint="Only used while there is no photograph above — it generates a stand-in so listings are never full of blank boxes."
            >
              <Input value={draft.seed} onChange={(event) => set('seed', event.target.value)} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Details" description="The byline row and the tags at the foot of the article.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" hint="Shown as written.">
            <Input value={draft.date} onChange={(event) => set('date', event.target.value)} placeholder="April 1, 2021" />
          </Field>

          <Field label="Read time">
            <Input value={draft.readTime} onChange={(event) => set('readTime', event.target.value)} placeholder="7 min read" />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Tags" hint="One per line.">
            <Textarea
              rows={4}
              value={draft.tags.join('\n')}
              onChange={(event) => set('tags', event.target.value.split('\n').map((tag) => tag.trim()).filter(Boolean))}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Body"
        description="Built from blocks so the site keeps control of headings, quotes and lists — section headings become the article’s anchors."
      >
        <BlockEditor body={draft.body} onChange={(body) => set('body', body)} siteUrl={siteUrl} />
      </Section>

      <SaveBar
        dirty={dirty}
        pending={pending}
        notice={notice}
        onSave={save}
        onReset={mode === 'edit' ? () => setDraft(post) : undefined}
        saveLabel={mode === 'create' ? 'Create post' : 'Save changes'}
      >
        {mode === 'edit' ? (
          <button type="button" className="btn-danger btn-sm" onClick={remove}>
            Delete post
          </button>
        ) : null}
      </SaveBar>
    </div>
  )
}
