/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetHowWeWorkQuery, useUpdateSectionMutation, useDeleteStepMutation } from '@/store/howWeWorkApi'
import type { HowWeWorkSection, SectionFiles, SectionText } from '@/store/howWeWorkApi'
import type { Localized } from '@/store/bannerApi'
import StepDrawer from './stepDrawer'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2

const SECTION_FIELDS: { key: keyof SectionText; label: string }[] = [
  { key: 'title', label: 'Title (black part)' },
  { key: 'colorTitle', label: 'Colored title (green part)' },
  { key: 'subtitle', label: 'Subtitle' },
  { key: 'watermark', label: 'Watermark' },
]

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

/* ---------- Section editor (heading + photo) ---------- */

const SectionEditor = ({ section }: { section: HowWeWorkSection }) => {
  const [draft, setDraft] = useState<SectionText>({
    title: section.title,
    colorTitle: section.colorTitle,
    subtitle: section.subtitle,
    watermark: section.watermark,
  })
  const [files, setFiles] = useState<SectionFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: keyof SectionText, code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleImage = (code: Lang, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [IMAGE_FIELD[code]]: file }))
  }

  const save = async () => {
    for (const f of SECTION_FIELDS) {
      for (const { code, name } of LANGS) {
        if (draft[f.key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection({
        data: {
          title: trimLocalized(draft.title),
          colorTitle: trimLocalized(draft.colorTitle),
          subtitle: trimLocalized(draft.subtitle),
          watermark: trimLocalized(draft.watermark),
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
        <h6 className="fw-bold mb-3">Section heading</h6>

        {SECTION_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map(({ code, dir }) => (
                <div className="col-6" key={code}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    dir={dir}
                    lang={code}
                    value={draft[f.key][code]}
                    onChange={(e) => setValue(f.key, code, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <h6 className="fw-bold mt-4 mb-3">Photo (left side)</h6>
        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => {
            const existing = section.image[code]

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
                  onChange={(e) => handleImage(code, e)}
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

const HowWeWorkAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetHowWeWorkQuery()
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
      <h5 className="fw-bold mb-3">How We Work</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Steps ({steps.length})</h6>
        <StepDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {steps.map((s, index) => (
          <div key={s._id} className="list-group-item d-flex align-items-center gap-3">
            <div className="fw-bold text-success" style={{ minWidth: 64 }}>
              STEP {index + 1}
            </div>

            <div className="flex-grow-1">
              <div className="fw-semibold">{s.title.en}</div>
              <div className="small text-muted">{s.desc.en}</div>
              <div className="small text-muted" dir="rtl" lang="ar">
                {s.title.ar} · {s.desc.ar}
              </div>
              <div className="small text-muted">
                Order {s.order} · icon: {s.icon}
              </div>
            </div>

            <StepDrawer step={s} nextOrder={nextOrder} />

            <button type="button" className="btn btn-soft-danger" onClick={() => remove(s._id, s.title.en)} aria-label="Delete step">
              <IconifyIcon icon="solar:trash-bin-trash-broken" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowWeWorkAdminPage
