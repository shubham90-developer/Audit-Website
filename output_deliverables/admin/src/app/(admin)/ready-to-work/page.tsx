/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetReadyToWorkQuery, useUpdateSectionMutation, useDeleteFeatureMutation } from '@/store/readytoworkapi'
import type { ReadyToWorkSection, SectionFiles, SectionText } from '@/store/readytoworkapi'
import type { Localized } from '@/store/bannerApi'
import FeatureDrawer from './featureDrawer'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const BG_FIELD = { en: 'bgImageEn', ar: 'bgImageAr' } as const
const MIN_LENGTH = 2

type LocalizedKey = Exclude<keyof SectionText, 'buttonHref'>

const TEXT_FIELDS: { key: LocalizedKey; label: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Title (first line)' },
  { key: 'highlight', label: 'Highlighted name (second line)' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'buttonLabel', label: 'Button label' },
  { key: 'tagOne', label: 'Tag 1 (under the button)' },
  { key: 'tagTwo', label: 'Tag 2 (under the button)' },
]

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

// Same rule as the backend: a path, an anchor, or an http(s) URL
const isSafeHref = (v: string) => /^(\/|#|https?:\/\/)/i.test(v.trim())

/* ---------- Section editor ---------- */

const SectionEditor = ({ section }: { section: ReadyToWorkSection }) => {
  const [draft, setDraft] = useState<SectionText>({
    title: section.title,
    highlight: section.highlight,
    description: section.description,
    buttonLabel: section.buttonLabel,
    buttonHref: section.buttonHref,
    tagOne: section.tagOne,
    tagTwo: section.tagTwo,
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
        if (draft[f.key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    if (!isSafeHref(draft.buttonHref)) {
      toast.error('Button link must start with /, # or http(s)://')
      return
    }

    try {
      await updateSection({
        data: {
          title: trimLocalized(draft.title),
          highlight: trimLocalized(draft.highlight),
          description: trimLocalized(draft.description),
          buttonLabel: trimLocalized(draft.buttonLabel),
          buttonHref: draft.buttonHref.trim(),
          tagOne: trimLocalized(draft.tagOne),
          tagTwo: trimLocalized(draft.tagTwo),
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

        <div className="mb-3">
          <div className="small fw-semibold mb-1">Button link</div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="/contact"
            value={draft.buttonHref}
            onChange={(e) => setDraft((prev) => ({ ...prev, buttonHref: e.target.value }))}
            disabled={isLoading}
          />
          <small className="text-muted">Same link for both languages. Start with /, # or http(s)://</small>
        </div>

        <h6 className="fw-bold mt-4 mb-3">Background image</h6>
        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => {
            const existing = section.bgImage[code]

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

const ReadyToWorkAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetReadyToWorkQuery()
  const [deleteFeature] = useDeleteFeatureMutation()

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

  const { section, features } = data
  const nextOrder = features.length === 0 ? 0 : Math.max(...features.map((f) => f.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteFeature(id).unwrap()
      toast.success('Card deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Ready to Work</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Bottom cards ({features.length})</h6>
        <FeatureDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {features.map((f) => (
          <div key={f._id} className="list-group-item d-flex align-items-center gap-3">
            <div className="flex-grow-1">
              <div className="fw-semibold">{f.label.en}</div>
              <div className="small text-muted" dir="rtl" lang="ar">
                {f.label.ar}
              </div>
              <div className="small text-muted">
                Order {f.order} · icon: {f.icon}
              </div>
            </div>

            <FeatureDrawer feature={f} nextOrder={nextOrder} />

            <button type="button" className="btn btn-soft-danger" onClick={() => remove(f._id, f.label.en)} aria-label="Delete card">
              <IconifyIcon icon="solar:trash-bin-trash-broken" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadyToWorkAdminPage
