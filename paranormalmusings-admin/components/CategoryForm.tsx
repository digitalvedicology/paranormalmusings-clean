'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageField from './ImageField'
import Repeatable from './Repeatable'
import SaveBar from './SaveBar'
import { SlugList, SlugSelect, type PostOption } from './SlugPicker'
import { Field, Input, Section, Select, Textarea, Toggle } from './ui'
import { useSave } from './useSave'
import { ART_KEYS, LAYOUTS, type CategoryPage } from '@/lib/types'

/**
 * Everything that decides how one category page looks and reads.
 *
 * The form holds a whole draft category and PATCHes it in one request, so the
 * page you are editing is never half-saved — the layout switch and the copy it
 * depends on always land together.
 */
export default function CategoryForm({
  category,
  posts,
  siteUrl,
}: {
  category: CategoryPage
  posts: PostOption[]
  siteUrl: string
}) {
  const router = useRouter()
  const { pending, notice, setNotice, send } = useSave()
  const [draft, setDraft] = useState<CategoryPage>(category)

  const dirty = JSON.stringify(draft) !== JSON.stringify(category)
  const set = <K extends keyof CategoryPage>(key: K, value: CategoryPage[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const setHub = <K extends keyof CategoryPage['hub']>(key: K, value: CategoryPage['hub'][K]) =>
    setDraft((current) => ({ ...current, hub: { ...current.hub, [key]: value } }))

  const save = () => send(`/api/categories/${category.key}`, { payload: draft })

  async function remove() {
    if (!confirm(`Delete the "${draft.label}" page? This cannot be undone.`)) return

    const response = await fetch(`/api/categories/${category.key}`, { method: 'DELETE' })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setNotice({ kind: 'error', text: data.error ?? 'Could not delete that page', problems: data.problems })
      return
    }

    router.replace('/pages')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Section
        title="Page details"
        description="The name and address this page carries everywhere it is linked from."
        aside={
          <a href={`${siteUrl}${draft.href}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm shrink-0">
            View ↗
          </a>
        }
      >
        <div className="space-y-4">
          <Toggle
            checked={draft.published}
            onChange={(next) => set('published', next)}
            label="Published"
            hint="When off, the page drops out of the menu, the footer and every listing, and its posts stop being served."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Menu label" hint="The short name — used in the nav, on chips and above cards.">
              <Input value={draft.label} onChange={(event) => set('label', event.target.value)} />
            </Field>

            <Field label="Address" hint="The path the page lives at. Nav links follow it automatically.">
              <Input value={draft.href} onChange={(event) => set('href', event.target.value)} />
            </Field>
          </div>

          <Field label="Page title" hint="The heading on the page itself, and its browser title.">
            <Input value={draft.title} onChange={(event) => set('title', event.target.value)} />
          </Field>

          <Field label="Standfirst" hint="The paragraph under the title at the top of the page.">
            <Textarea value={draft.lede} rows={3} onChange={(event) => set('lede', event.target.value)} />
          </Field>

          <Field label="Short blurb" hint="One line, shown on cards elsewhere on the site that link into this page.">
            <Textarea value={draft.blurb} rows={2} onChange={(event) => set('blurb', event.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Layout and artwork" description="How the page is built, and which drawn backdrop it opens with.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Layout"
            hint={
              draft.layout === 'hub'
                ? 'Featured piece across the top, a paginated card grid, then a closing call to action.'
                : 'A plain reverse-chronological list of everything in the category.'
            }
          >
            <Select
              value={draft.layout}
              onChange={(event) => set('layout', event.target.value as CategoryPage['layout'])}
              options={LAYOUTS.map((value) => ({
                value,
                label: value === 'hub' ? 'Curated hub' : 'Archive list',
              }))}
            />
          </Field>

          <Field label="Banner artwork" hint="One of the four drawn backdrops the hero slider uses.">
            <Select
              value={draft.art}
              onChange={(event) => set('art', event.target.value as CategoryPage['art'])}
              options={ART_KEYS.map((value) => ({ value, label: value.replace('art-', 'Backdrop ') }))}
            />
          </Field>

          <Field label="Stories figure" hint='The number in "See all N stories". A display figure, not a count.'>
            <Input
              type="number"
              min={0}
              value={draft.count}
              onChange={(event) => set('count', Number(event.target.value))}
            />
          </Field>
        </div>

        <div className="mt-5 space-y-4 border-t border-rule pt-5">
          <ImageField
            label="Section photograph"
            value={draft.image}
            onChange={(image) => set('image', image)}
            siteUrl={siteUrl}
            hint="Shown on the cards that link into this section, from the home page and from the other sections."
          />

          <Field
            label="Placeholder seed"
            hint="Only used while there is no photograph above."
          >
            <Input value={draft.seed} onChange={(event) => set('seed', event.target.value)} />
          </Field>
        </div>
      </Section>

      {/* The hub fields drive a layout this page may not be using — say so
          rather than hiding them, so the curation is not lost or forgotten. */}
      <Section
        title="Curated hub"
        description={
          draft.layout === 'hub'
            ? 'What the hub layout features and groups.'
            : 'Kept for when this page is switched to the curated hub layout — not shown while it is an archive list.'
        }
      >
        <div className="space-y-5">
          <Field label="Featured piece" hint="The cornerstone article shown across the top of the hub.">
            <SlugSelect
              value={draft.hub.pillar ?? ''}
              options={posts}
              onChange={(next) => setHub('pillar', next || null)}
            />
          </Field>

          <div>
            <p className="label mb-2">Themed clusters</p>
            <Repeatable
              items={draft.hub.clusters}
              onChange={(next) => setHub('clusters', next)}
              create={() => ({ title: '', blurb: '', slugs: [] })}
              addLabel="Add a cluster"
              empty="No clusters yet."
              rowLabel={(cluster, index) => cluster.title || `Cluster ${index + 1}`}
              render={(cluster, setCluster) => (
                <div className="space-y-3">
                  <Field label="Title">
                    <Input value={cluster.title} onChange={(event) => setCluster({ ...cluster, title: event.target.value })} />
                  </Field>
                  <Field label="Blurb">
                    <Textarea
                      rows={2}
                      value={cluster.blurb}
                      onChange={(event) => setCluster({ ...cluster, blurb: event.target.value })}
                    />
                  </Field>
                  <div>
                    <p className="label mb-1.5">Posts in this cluster</p>
                    <SlugList value={cluster.slugs} options={posts} onChange={(slugs) => setCluster({ ...cluster, slugs })} />
                  </div>
                </div>
              )}
            />
          </div>

          <div>
            <p className="label mb-2">Questions readers arrive with</p>
            <Repeatable
              items={draft.hub.questions}
              onChange={(next) => setHub('questions', next)}
              create={() => ({ question: '', slug: '' })}
              addLabel="Add a question"
              empty="No questions yet."
              rowLabel={(entry, index) => entry.question || `Question ${index + 1}`}
              render={(entry, setEntry) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Question">
                    <Input value={entry.question} onChange={(event) => setEntry({ ...entry, question: event.target.value })} />
                  </Field>
                  <Field label="Answered by">
                    <SlugSelect
                      value={entry.slug}
                      options={posts}
                      allowEmpty={false}
                      onChange={(slug) => setEntry({ ...entry, slug })}
                    />
                  </Field>
                </div>
              )}
            />
          </div>
        </div>
      </Section>

      <SaveBar dirty={dirty} pending={pending} notice={notice} onSave={save} onReset={() => setDraft(category)}>
        <button type="button" className="btn-danger btn-sm" onClick={remove}>
          Delete page
        </button>
      </SaveBar>
    </div>
  )
}
