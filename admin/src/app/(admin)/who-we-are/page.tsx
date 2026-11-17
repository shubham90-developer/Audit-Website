'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetWhoWeAreQuery, useUpdateWhoWeAreSectionMutation, useDeleteWhoWeAreItemMutation } from '@/store/whoWeAreApi'
import type { SectionText, WhoWeAreSection, WhoWeAreItem } from '@/store/whoWeAreApi'
import type { Localized } from '@/store/bannerApi'
import ItemDrawer from './who-we-are-drawer'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
type TextField = { key: keyof SectionText; label: string; multiline?: boolean; optional?: boolean }

// Every text field of the section, grouped the way it appears on the page
const TEXT_GROUPS: { title: string; fields: TextField[] }[] = [
  {
    title: 'Headline',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow pill' },
      { key: 'headlinePrefix', label: 'Headline start (black)' },
      { key: 'highlight', label: 'Highlighted word (green, underlined)' },
      { key: 'headlineSuffix', label: 'Headline end (black)' },
    ],
  },
  {
    title: 'Paragraph',
    fields: [
      { key: 'brandName', label: 'Firm name (bold)' },
      { key: 'body', label: 'Paragraph after the firm name', multiline: true },
    ],
  },
  {
    title: 'Quote and button',
    fields: [
      { key: 'quote', label: 'Quote', multiline: true },
      { key: 'ctaLabel', label: 'Button label' },
      { key: 'ctaHref', label: 'Button link (e.g. /services)' },
    ],
  },
  {
    title: 'Snapshot panel',
    fields: [
      { key: 'snapshotTitle', label: 'Panel title' },
      { key: 'snapshotTagline', label: 'Panel tagline' },
    ],
  },
  {
    title: 'Script watermark',
    fields: [{ key: 'watermark', label: 'Watermark text (optional)', optional: true }],
  },
]

const FIELDS = TEXT_GROUPS.flatMap((g) => g.fields)

const emptyLocalized: Localized = { en: '', ar: '' }

// Copies the section's text into the form. Older documents may lack watermark.
const pickText = (s: WhoWeAreSection): SectionText => ({
  eyebrow: s.eyebrow,
  headlinePrefix: s.headlinePrefix,
  highlight: s.highlight,
  headlineSuffix: s.headlineSuffix,
  brandName: s.brandName,
  body: s.body,
  quote: s.quote,
  ctaLabel: s.ctaLabel,
  ctaHref: s.ctaHref,
  watermark: s.watermark ?? emptyLocalized,
  snapshotTitle: s.snapshotTitle,
  snapshotTagline: s.snapshotTagline,
})

const trimText = (d: SectionText): SectionText =>
  Object.fromEntries(Object.entries(d).map(([key, v]) => [key, { en: v.en.trim(), ar: v.ar.trim() }])) as SectionText

/* ---------- Section text editor ---------- */

const SectionEditor = ({ section }: { section: WhoWeAreSection }) => {
  const [draft, setDraft] = useState<SectionText>(() => pickText(section))
  const [updateSection, { isLoading }] = useUpdateWhoWeAreSectionMutation()

  const setValue = (key: keyof SectionText, code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const save = async () => {
    for (const f of FIELDS) {
      if (f.optional) continue
      for (const { code, name } of LANGS) {
        if (!draft[f.key][code].trim()) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection(trimText(draft)).unwrap()
      toast.success('Section saved')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Section text</h6>

        {TEXT_GROUPS.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="small text-uppercase text-muted fw-semibold mb-2">{group.title}</div>

            {group.fields.map((f) => (
              <div key={f.key} className="mb-3">
                <div className="small fw-semibold mb-1">{f.label}</div>
                <div className="row g-2">
                  {LANGS.map(({ code, dir }) => (
                    <div className="col-6" key={code}>
                      {f.multiline ? (
                        <textarea
                          rows={3}
                          className="form-control form-control-sm"
                          dir={dir}
                          lang={code}
                          value={draft[f.key][code]}
                          onChange={(e) => setValue(f.key, code, e.target.value)}
                          disabled={isLoading}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          dir={dir}
                          lang={code}
                          value={draft[f.key][code]}
                          onChange={(e) => setValue(f.key, code, e.target.value)}
                          disabled={isLoading}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

const WhoWeAreAdminPage = () => {
  const { data: section, isLoading, isError, refetch } = useGetWhoWeAreQuery()
  const [deleteItem] = useDeleteWhoWeAreItemMutation()

  if (isLoading) return <div className="p-3 text-muted">Loading...</div>

  if (isError || !section) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the content.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  // The API returns cards sorted by order
  const items: WhoWeAreItem[] = section.snapshotItems
  const nextOrder = items.length === 0 ? 0 : Math.max(...items.map((i) => i.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteItem(id).unwrap()
      toast.success('Card deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Who We Are</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Snapshot cards ({items.length})</h6>
        <ItemDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {items.map((item) => (
          <div key={item._id} className="list-group-item d-flex align-items-center gap-3">
            <div className="text-muted" style={{ minWidth: 64 }}>
              <IconifyIcon icon="solar:hashtag-broken" /> {item.order}
            </div>

            <div className="flex-grow-1">
              <div className="fw-semibold">
                {item.label.en} <span className="text-muted fw-normal">· {item.value.en}</span>
              </div>
              <div className="small text-muted" dir="rtl" lang="ar">
                {item.label.ar} · {item.value.ar}
              </div>
              <div className="small text-muted">
                icon: {item.icon}
                {item.note.en && ` · note: ${item.note.en}`}
              </div>
            </div>

            <ItemDrawer item={item} nextOrder={nextOrder} />

            <button type="button" className="btn btn-soft-danger" onClick={() => remove(item._id, item.label.en)} aria-label="Delete card">
              <IconifyIcon icon="solar:trash-bin-trash-broken" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhoWeAreAdminPage
