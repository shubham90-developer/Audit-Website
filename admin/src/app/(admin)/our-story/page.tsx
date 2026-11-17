/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import RichTextEditor from '@/components/RichTextEditor'
import { useGetOurStoryQuery, useUpdateSectionMutation, useDeleteStepMutation } from '@/store/ourStoryApi'
import type { OurStorySection, SectionFiles, SectionText } from '@/store/ourStoryApi'
import type { Localized } from '@/store/bannerApi'
import StepDrawer from './drawer'
import ImagePicker, { canPreview } from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
type TextKey = keyof SectionText

// rich = text editor (bold, italic, colors), plain = one line
const TEXT_FIELDS: { key: TextKey; label: string; kind: 'rich' | 'plain'; hint?: string }[] = [
  { key: 'badge', label: 'Badge', kind: 'plain', hint: 'e.g. "OUR STORY"' },
  { key: 'narrative', label: 'Story paragraph', kind: 'rich' },
  { key: 'quote', label: 'Quote (dark card)', kind: 'rich' },
  { key: 'authorName', label: 'Author name', kind: 'plain' },
  { key: 'authorRole', label: 'Author role', kind: 'plain' },
]

// Strips tags to check whether an editor value has any visible text
const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

/* ---------- Section editor ---------- */

const SectionEditor = ({ section }: { section: OurStorySection }) => {
  const [draft, setDraft] = useState<SectionText>({
    badge: section.badge,
    narrative: section.narrative,
    quote: section.quote,
    authorName: section.authorName,
    authorRole: section.authorRole,
  })
  const [files, setFiles] = useState<SectionFiles>({})
  const [pickerKey, setPickerKey] = useState(0)
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: TextKey, code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const save = async () => {
    for (const f of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        const value = draft[f.key][code]
        const ok = f.kind === 'rich' ? hasText(value) : value.trim().length >= 2
        if (!ok) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection({
        data: {
          badge: trimLocalized(draft.badge),
          narrative: trimLocalized(draft.narrative),
          quote: trimLocalized(draft.quote),
          authorName: trimLocalized(draft.authorName),
          authorRole: trimLocalized(draft.authorRole),
        },
        files,
      }).unwrap()
      toast.success('Section saved')
      setFiles({})
      setPickerKey((k) => k + 1)
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

                  {f.kind === 'rich' ? (
                    <RichTextEditor
                      value={draft[f.key][code]}
                      onChange={(html) => setValue(f.key, code, html)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
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
            {f.hint && <small className="text-muted">{f.hint}</small>}
          </div>
        ))}

        <h6 className="fw-bold mt-4 mb-3">Images</h6>

        <div className="row g-3 mb-3">
          {LANGS.map(({ code, name }) => (
            <div className="col-6" key={code}>
              <ImagePicker
                label={`Author photo (${name})`}
                current={section.authorImage[code][0]}
                disabled={isLoading}
                pickerKey={`${pickerKey}-author-${code}`}
                onPick={(file) => setFiles((prev) => ({ ...prev, [code === 'en' ? 'authorImageEn' : 'authorImageAr']: file }))}
              />
            </div>
          ))}
        </div>

        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => (
            <div className="col-6" key={code}>
              <ImagePicker
                label={`Section background (${name})`}
                current={section.bgImage[code][0]}
                disabled={isLoading}
                pickerKey={`${pickerKey}-bg-${code}`}
                onPick={(file) => setFiles((prev) => ({ ...prev, [code === 'en' ? 'bgImageEn' : 'bgImageAr']: file }))}
              />
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

// Plain text version of editor HTML, for the list preview
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const OurStoryAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetOurStoryQuery()
  const [deleteStep] = useDeleteStepMutation()

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

  const { section, steps } = data
  const nextOrder = steps.length === 0 ? 0 : Math.max(...steps.map((s) => s.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteStep(id).unwrap()
      toast.success('Step deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Our Story</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Steps ({steps.length})</h6>
        <StepDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {steps.map((s, index) => {
          const thumb = s.image.en[0]?.url ?? s.image.ar[0]?.url

          return (
            <div key={s._id} className="list-group-item d-flex align-items-center gap-3">
              <div className="fw-bold text-success" style={{ minWidth: 32 }}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {canPreview(thumb) ? (
                <img src={thumb} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <div className="bg-light rounded-circle" style={{ width: 48, height: 48 }} />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">{stripHtml(s.title.en)}</div>
                <div className="small text-muted">{stripHtml(s.text.en)}</div>
                <div className="small text-muted" dir="rtl" lang="ar">
                  {stripHtml(s.title.ar)}
                </div>
                <div className="small text-muted">Order {s.order}</div>
              </div>

              <StepDrawer step={s} nextOrder={nextOrder} />

              <button type="button" className="btn btn-soft-danger" onClick={() => remove(s._id, stripHtml(s.title.en))} aria-label="Delete step">
                <IconifyIcon icon="solar:trash-bin-trash-broken" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OurStoryAdminPage
