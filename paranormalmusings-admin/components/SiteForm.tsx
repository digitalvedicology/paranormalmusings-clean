'use client'

import { useState } from 'react'
import ImageField from './ImageField'
import SaveBar from './SaveBar'
import { Field, Input, Section, Textarea } from './ui'
import { useSave } from './useSave'
import type { SiteSettings } from '@/lib/types'

/**
 * The details that appear on every page: the masthead, the byline, and the
 * contact block in the footer and on the contact page.
 */
export default function SiteForm({ site, siteUrl }: { site: SiteSettings; siteUrl: string }) {
  const { pending, notice, send } = useSave()
  const [draft, setDraft] = useState<SiteSettings>(site)

  const dirty = JSON.stringify(draft) !== JSON.stringify(site)
  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <div className="space-y-6">
      <Section title="Masthead" description="The name and line that identify the publication.">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name">
              <Input value={draft.name} onChange={(event) => set('name', event.target.value)} />
            </Field>
            <Field label="Author" hint="The byline on every article.">
              <Input value={draft.author} onChange={(event) => set('author', event.target.value)} />
            </Field>
          </div>

          <Field label="Tagline">
            <Input value={draft.tagline} onChange={(event) => set('tagline', event.target.value)} />
          </Field>

          <Field label="Description" hint="Used as the site's meta description and in link previews.">
            <Textarea rows={3} value={draft.description} onChange={(event) => set('description', event.target.value)} />
          </Field>

          <ImageField
            label="Author portrait"
            value={draft.authorImage}
            onChange={(image) => set('authorImage', image)}
            siteUrl={siteUrl}
            shape="square"
            hint="The face beside every byline, in the article sidebar, and on the about page. Square crops best — it is shown as a circle in most places."
          />
        </div>
      </Section>

      <Section title="Contact" description="Shown in the footer and on the contact page.">
        <div className="space-y-4">
          <Field label="Address" hint="One line per line.">
            <Textarea
              rows={3}
              value={draft.address.join('\n')}
              onChange={(event) =>
                set('address', event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" hint="As displayed.">
              <Input value={draft.phone.label} onChange={(event) => set('phone', { ...draft.phone, label: event.target.value })} />
            </Field>
            <Field label="Phone link" hint="What tapping it dials, e.g. tel:+919840014586">
              <Input value={draft.phone.href} onChange={(event) => set('phone', { ...draft.phone, href: event.target.value })} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" hint="As displayed.">
              <Input value={draft.email.label} onChange={(event) => set('email', { ...draft.email, label: event.target.value })} />
            </Field>
            <Field label="Email link" hint="e.g. mailto:support@vedicology.com">
              <Input value={draft.email.href} onChange={(event) => set('email', { ...draft.email, href: event.target.value })} />
            </Field>
          </div>
        </div>
      </Section>

      <SaveBar
        dirty={dirty}
        pending={pending}
        notice={notice}
        onSave={() => send('/api/site', { payload: draft })}
        onReset={() => setDraft(site)}
      />
    </div>
  )
}
