'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, Input, Notice, Section } from './ui'
import { useSave } from './useSave'

/**
 * Creating a page asks for the minimum — a key, a name and an address — and
 * drops you straight into the full editor for the rest. A new page arrives
 * unpublished, so nothing appears on the site until its copy is written.
 */
export default function NewPageForm() {
  const router = useRouter()
  const { pending, notice, send } = useSave()

  const [label, setLabel] = useState('')
  const [key, setKey] = useState('')
  const [href, setHref] = useState('')
  const [touchedKey, setTouchedKey] = useState(false)
  const [touchedHref, setTouchedHref] = useState(false)

  const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const dashed = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  // Key and address follow the name until you edit either one yourself.
  const onLabel = (value: string) => {
    setLabel(value)
    if (!touchedKey) setKey(clean(value))
    if (!touchedHref) setHref(`/${dashed(value)}`)
  }

  async function create() {
    await send<{ category: { key: string } }>('/api/categories', {
      method: 'POST',
      payload: { key, label, title: label, href },
      onDone: (data) => {
        router.replace(`/pages/${data.category.key}`)
        router.refresh()
      },
    })
  }

  return (
    <Section title="New page" description="A new section of the site, with its own address and its own posts.">
      <div className="space-y-4">
        <Field label="Name" hint="What the page is called in the menu.">
          <Input value={label} onChange={(event) => onLabel(event.target.value)} placeholder="Southern Views" autoFocus />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Key" hint="The internal id posts are filed under. Letters and digits, no spaces. Cannot be changed later.">
            <Input
              value={key}
              onChange={(event) => {
                setTouchedKey(true)
                setKey(clean(event.target.value))
              }}
              placeholder="southern"
            />
          </Field>

          <Field label="Address" hint="The path the page lives at.">
            <Input
              value={href}
              onChange={(event) => {
                setTouchedHref(true)
                setHref(event.target.value)
              }}
              placeholder="/southern-views"
            />
          </Field>
        </div>

        {notice ? <Notice notice={notice} /> : null}

        <div className="flex justify-end gap-2 border-t border-rule pt-4">
          <button type="button" className="btn-ghost" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={create} disabled={pending || !label || !key || !href}>
            {pending ? 'Creating…' : 'Create page'}
          </button>
        </div>
      </div>
    </Section>
  )
}
