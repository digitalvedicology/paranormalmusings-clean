'use client'

import { useState } from 'react'
import SaveBar from './SaveBar'
import { SlugList, SlugSelect, type PostOption } from './SlugPicker'
import { Field, Input, Section, Select } from './ui'
import { useSave } from './useSave'
import type { HomeSettings } from '@/lib/types'

/**
 * The home page is a sequence of bands, and each band is a slot this screen
 * fills: which category leads, which posts are pulled forward, which case
 * study takes the spotlight. Nothing here changes the design — only what the
 * design is pointed at.
 */
export default function HomeForm({
  home,
  posts,
  categories,
}: {
  home: HomeSettings
  posts: PostOption[]
  categories: { key: string; label: string }[]
}) {
  const { pending, notice, send } = useSave()
  const [draft, setDraft] = useState<HomeSettings>(home)

  const dirty = JSON.stringify(draft) !== JSON.stringify(home)
  const set = <K extends keyof HomeSettings>(key: K, value: HomeSettings[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  const options = categories.map((entry) => ({ value: entry.key, label: entry.label }))

  return (
    <div className="space-y-6">
      <Section title="Which sections lead" description="The two bands that show a whole category rather than a chosen list.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Feature band" hint="The large band: one lead story, three beside it, two underneath.">
            <Select value={draft.featureCategory} onChange={(event) => set('featureCategory', event.target.value)} options={options} />
          </Field>

          <Field label="Card band" hint="Three cards with a compact list beside them.">
            <Select value={draft.cardBandCategory} onChange={(event) => set('cardBandCategory', event.target.value)} options={options} />
          </Field>
        </div>
        <p className="mt-3 text-[12.5px] text-muted">
          Both bands show their section&rsquo;s six most recent posts, so there is nothing further to choose.
        </p>
      </Section>

      <Section title="Highlights" description="The three pieces directly under the hero.">
        <SlugList value={draft.highlights} options={posts} onChange={(next) => set('highlights', next)} hint="Three works best; the band is built for it." />
      </Section>

      <Section title="Spotlight" description="The single full-width piece set against a dark backdrop.">
        <div className="space-y-4">
          <Field label="The piece">
            <SlugSelect value={draft.spotlight.slug} options={posts} onChange={(slug) => set('spotlight', { ...draft.spotlight, slug })} />
          </Field>

          <Field label="Image description" hint="Read aloud by screen readers in place of the photograph.">
            <Input
              value={draft.spotlight.alt}
              onChange={(event) => set('spotlight', { ...draft.spotlight, alt: event.target.value })}
              placeholder="A figure standing in a lit doorway at the end of a dark passage"
            />
          </Field>
        </div>
      </Section>

      <Section title="Investigation rows" description="The compact numbered list in the investigation band.">
        <SlugList value={draft.investigationRows} options={posts} onChange={(next) => set('investigationRows', next)} />
      </Section>

      <Section title="Latest posts" description="The grid near the foot of the page.">
        <SlugList value={draft.latestPosts} options={posts} onChange={(next) => set('latestPosts', next)} />
      </Section>

      <SaveBar
        dirty={dirty}
        pending={pending}
        notice={notice}
        onSave={() => send('/api/home', { payload: draft })}
        onReset={() => setDraft(home)}
      />
    </div>
  )
}
