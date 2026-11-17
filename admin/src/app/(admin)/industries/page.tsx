/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import RichTextEditor from '@/components/RichTextEditor'
import { INDUSTRY_ICON_OPTIONS, useGetIndustriesQuery, useUpdateSectionMutation, useDeleteIndustryMutation } from '@/store/industriesApi'
import type { IndustriesSection, IndustryIcon, SectionFiles, SectionText } from '@/store/industriesApi'
import type { Localized } from '@/store/bannerApi'
import IndustryDrawer from './industriesDrawer'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const BG_FIELD = { en: 'sectionBgEn', ar: 'sectionBgAr' } as const
const MIN_LENGTH = 2

type LocalizedKey = Exclude<keyof SectionText, 'footerIcon'>

// kind: rich = text editor (colors, bold), input = one line, textarea = paragraph
const TEXT_FIELDS: { key: LocalizedKey; label: string; kind: 'rich' | 'input' | 'textarea'; hint?: string }[] = [
  { key: 'watermark', label: 'Watermark', kind: 'input', hint: 'Faint text behind the heading' },
  { key: 'title', label: 'Title', kind: 'rich', hint: 'Select the word to color it green' },
  { key: 'description', label: 'Intro paragraph', kind: 'textarea' },
  { key: 'footerTitle', label: 'Bottom box title', kind: 'rich', hint: 'Select text to color it green' },
  { key: 'footerNote', label: 'Bottom box small note', kind: 'input' },
]

// Strips tags to check whether an editor value has any visible text
const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

/* ---------- Section editor ---------- */

const SectionEditor = ({ section }: { section: IndustriesSection }) => {
  const [draft, setDraft] = useState<SectionText>({
    watermark: section.watermark,
    title: section.title,
    description: section.description,
    footerTitle: section.footerTitle,
    footerNote: section.footerNote,
    footerIcon: section.footerIcon,
  })
  const [files, setFiles] = useState<SectionFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: LocalizedKey, code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleBg = (code: Lang, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [BG_FIELD[code]]: file }))
  }

  const save = async () => {
    for (const f of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        const value = draft[f.key][code]
        const ok = f.kind === 'rich' ? hasText(value) : value.trim().length >= MIN_LENGTH
        if (!ok) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection({
        data: {
          watermark: trimLocalized(draft.watermark),
          title: trimLocalized(draft.title),
          description: trimLocalized(draft.description),
          footerTitle: trimLocalized(draft.footerTitle),
          footerNote: trimLocalized(draft.footerNote),
          footerIcon: draft.footerIcon,
        },
        files,
      }).unwrap()
      toast.success('Section saved')
      setFiles({})
      setFileKey((k) => k + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Section text</h6>

        {TEXT_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map(({ code, name, dir }) => (
                <div className="col-6" key={code}>
                  <div className="small text-muted mb-1">{name}</div>

                  {f.kind === 'rich' && (
                    <RichTextEditor
                      value={draft[f.key][code]}
                      onChange={(html) => setValue(f.key, code, html)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  )}

                  {f.kind === 'input' && (
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

                  {f.kind === 'textarea' && (
                    <textarea
                      rows={4}
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
            {f.hint && <small className="text-muted">{f.hint}</small>}
          </div>
        ))}

        <div className="mb-3" style={{ maxWidth: 280 }}>
          <div className="small fw-semibold mb-1">Bottom box icon</div>
          <select
            className="form-select form-select-sm"
            value={draft.footerIcon}
            onChange={(e) => setDraft((prev) => ({ ...prev, footerIcon: e.target.value as IndustryIcon }))}
            disabled={isLoading}>
            {INDUSTRY_ICON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <h6 className="fw-bold mt-4 mb-3">Section background</h6>
        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => {
            const existing = section.sectionBg[code]

            return (
              <div className="col-6" key={code}>
                <div className="small text-muted mb-1">{name}</div>
                {existing.length > 0 ? (
                  <img src={existing[0].url} alt="" className="mb-2 rounded" style={{ width: 160, height: 90, objectFit: 'cover' }} />
                ) : (
                  <div className="small text-muted mb-2">No image yet</div>
                )}
                <input
                  key={`${fileKey}-${code}`}
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={(e) => handleBg(code, e)}
                  disabled={isLoading}
                />
                <small className="text-muted">A new image replaces the current one.</small>
              </div>
            )
          })}
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

const IndustriesAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetIndustriesQuery()
  const [deleteIndustry] = useDeleteIndustryMutation()

  if (isLoading) return <div className="p-3 text-muted">Loading...</div>

  if (isError || !data) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the content.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const { section, items } = data
  const nextOrder = items.length === 0 ? 0 : Math.max(...items.map((i) => i.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteIndustry(id).unwrap()
      toast.success('Industry deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Industries We Serve</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Industries ({items.length})</h6>
        <IndustryDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {items.map((it, index) => {
          const thumb = it.image.en[0]?.url ?? it.image.ar[0]?.url

          return (
            <div key={it._id} className="list-group-item d-flex align-items-center gap-3">
              <div className="fw-bold text-success" style={{ minWidth: 32 }}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {thumb ? (
                <img src={thumb} alt="" width={64} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div className="bg-light rounded" style={{ width: 64, height: 48 }} />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">{it.title.en}</div>
                <div className="small text-muted">{it.desc.en}</div>
                <div className="small text-muted" dir="rtl" lang="ar">
                  {it.title.ar}
                </div>
                <div className="small text-muted">
                  Order {it.order} · icon: {it.icon}
                </div>
              </div>

              <IndustryDrawer industry={it} nextOrder={nextOrder} />

              <button type="button" className="btn btn-soft-danger" onClick={() => remove(it._id, it.title.en)} aria-label="Delete industry">
                <IconifyIcon icon="solar:trash-bin-trash-broken" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default IndustriesAdminPage
