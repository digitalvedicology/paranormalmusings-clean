'use client'

import { useState } from 'react'
import ImageField from './ImageField'
import Repeatable from './Repeatable'
import SaveBar from './SaveBar'
import { SlugList, type PostOption } from './SlugPicker'
import { Field, Input, Section, Select, Textarea } from './ui'
import { useSave } from './useSave'
import { ICON_KEYS, type NavLink, type RelatedSite, type Topic } from '@/lib/types'

/**
 * The chrome around the pages: the header menu, the search overlay's
 * suggestions, the topic chips, and the two footer lists.
 *
 * All five save together in one request, because they are edited together and
 * a half-applied navigation is worse than none.
 */
export default function NavigationForm({
  navLinks,
  popularSearches,
  topics,
  relatedSites,
  footerPopular,
  posts,
  categories,
  siteUrl,
}: {
  navLinks: NavLink[]
  popularSearches: string[]
  topics: Topic[]
  relatedSites: RelatedSite[]
  footerPopular: string[]
  posts: PostOption[]
  categories: { key: string; label: string; href: string }[]
  siteUrl: string
}) {
  const original = { navLinks, popularSearches, topics, relatedSites, footerPopular }
  const { pending, notice, send } = useSave()
  const [draft, setDraft] = useState(original)

  const dirty = JSON.stringify(draft) !== JSON.stringify(original)
  const set = <K extends keyof typeof original>(key: K, value: (typeof original)[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <div className="space-y-6">
      <Section title="Menu" description="The links across the header, in order. Also drives the mobile drawer.">
        <Repeatable
          items={draft.navLinks}
          onChange={(next) => set('navLinks', next)}
          create={() => ({ label: '', href: '/', mobileLabel: '' })}
          addLabel="Add a link"
          rowLabel={(link, index) => link.label || `Link ${index + 1}`}
          render={(link, setLink) => (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Label">
                <Input value={link.label} onChange={(event) => setLink({ ...link, label: event.target.value })} />
              </Field>
              <Field label="Address">
                <Input value={link.href} onChange={(event) => setLink({ ...link, href: event.target.value })} />
              </Field>
              <Field label="Mobile label" hint="Optional — used in the drawer when there is room for more words.">
                <Input
                  value={link.mobileLabel}
                  placeholder={link.label}
                  onChange={(event) => setLink({ ...link, mobileLabel: event.target.value })}
                />
              </Field>
            </div>
          )}
        />
        <p className="mt-3 text-[12.5px] text-muted">
          A link pointing at an unpublished page is hidden automatically rather than left to 404.
        </p>
      </Section>

      <Section title="Topic chips" description="The row of labelled chips in the &ldquo;explore topics&rdquo; band.">
        <Repeatable
          items={draft.topics}
          onChange={(next) => set('topics', next)}
          create={() => ({ label: '', icon: 'wave' as Topic['icon'], href: categories[0]?.href ?? '/' })}
          addLabel="Add a topic"
          rowLabel={(topic, index) => topic.label || `Topic ${index + 1}`}
          render={(topic, setTopic) => (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Label">
                <Input value={topic.label} onChange={(event) => setTopic({ ...topic, label: event.target.value })} />
              </Field>
              <Field label="Icon">
                <Select
                  value={topic.icon}
                  onChange={(event) => setTopic({ ...topic, icon: event.target.value as Topic['icon'] })}
                  options={ICON_KEYS.map((key) => ({ value: key, label: key }))}
                />
              </Field>
              <Field label="Links to">
                <Input value={topic.href} onChange={(event) => setTopic({ ...topic, href: event.target.value })} />
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Search suggestions" description="Shown in the search overlay before anything is typed. One per line.">
        <Textarea
          rows={5}
          value={draft.popularSearches.join('\n')}
          onChange={(event) =>
            set(
              'popularSearches',
              event.target.value.split('\n').map((entry) => entry.trim()).filter(Boolean),
            )
          }
        />
      </Section>

      <Section title="Footer — popular posts" description="The list of pieces in the footer and in each article's sidebar.">
        <SlugList value={draft.footerPopular} options={posts} onChange={(next) => set('footerPopular', next)} />
      </Section>

      <Section title="Footer — related sites" description="The sister sites listed at the foot of every page.">
        <Repeatable
          items={draft.relatedSites}
          onChange={(next) => set('relatedSites', next)}
          create={() => ({ name: '', href: '', blurb: '', domain: '', image: '' })}
          addLabel="Add a site"
          rowLabel={(site, index) => site.name || `Site ${index + 1}`}
          render={(site, setSite) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <Input value={site.name} onChange={(event) => setSite({ ...site, name: event.target.value })} />
                </Field>
                <Field label="Address">
                  <Input value={site.href} onChange={(event) => setSite({ ...site, href: event.target.value })} />
                </Field>
              </div>
              <Field label="Domain" hint="Shown under the name, e.g. vedicology.com">
                <Input value={site.domain} onChange={(event) => setSite({ ...site, domain: event.target.value })} />
              </Field>
              <Field label="Blurb">
                <Textarea rows={2} value={site.blurb} onChange={(event) => setSite({ ...site, blurb: event.target.value })} />
              </Field>
              <ImageField
                label="Picture"
                value={site.image}
                onChange={(image) => setSite({ ...site, image })}
                siteUrl={siteUrl}
                hint="Optional. Sits across the top of the card in the footer — a logo or a photograph. Left empty, the card stays text-only as it is now."
              />
            </div>
          )}
        />
      </Section>

      <SaveBar
        dirty={dirty}
        pending={pending}
        notice={notice}
        onSave={() => send('/api/navigation', { payload: draft })}
        onReset={() => setDraft(original)}
      />
    </div>
  )
}
