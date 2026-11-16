'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetWhatWeDoQuery, useUpdateSectionMutation, useDeleteServiceMutation } from '@/store/whatWeDoApi'
import type { SectionText, WhatWeDoSection } from '@/store/whatWeDoApi'
import type { Localized } from '@/store/bannerApi'
import ServiceDrawer from './service'

const LANGS = ['en', 'ar'] as const
const MIN_LENGTH = 2

const SECTION_FIELDS: { key: keyof SectionText; label: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Title' },
  { key: 'colorTitle', label: 'Colored title' },
  { key: 'subtitle', label: 'Subtitle', multiline: true },
  { key: 'watermark', label: 'Watermark' },
]

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

/* ---------- Section heading editor ---------- */

const SectionEditor = ({ section }: { section: WhatWeDoSection }) => {
  const [draft, setDraft] = useState<SectionText>({
    title: section.title,
    colorTitle: section.colorTitle,
    subtitle: section.subtitle,
    watermark: section.watermark,
  })
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: keyof SectionText, code: 'en' | 'ar', value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const save = async () => {
    for (const f of SECTION_FIELDS) {
      for (const code of LANGS) {
        if (draft[f.key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please fill ${f.label} (${code === 'en' ? 'English' : 'Arabic'})`)
          return
        }
      }
    }

    try {
      await updateSection({
        title: trimLocalized(draft.title),
        colorTitle: trimLocalized(draft.colorTitle),
        subtitle: trimLocalized(draft.subtitle),
        watermark: trimLocalized(draft.watermark),
      }).unwrap()
      toast.success('Section saved')
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
              {LANGS.map((code) => (
                <div className="col-6" key={code}>
                  {f.multiline ? (
                    <textarea
                      rows={2}
                      className="form-control form-control-sm"
                      dir={code === 'ar' ? 'rtl' : 'ltr'}
                      lang={code}
                      value={draft[f.key][code]}
                      onChange={(e) => setValue(f.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      dir={code === 'ar' ? 'rtl' : 'ltr'}
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

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

const WhatWeDoAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetWhatWeDoQuery()
  const [deleteService] = useDeleteServiceMutation()

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

  const { section, services } = data
  const nextOrder = services.length === 0 ? 0 : Math.max(...services.map((s) => s.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteService(id).unwrap()
      toast.success('Service deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">What We Do</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Services ({services.length})</h6>
        <ServiceDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {services.map((s) => {
          const thumb = s.image.en[0]?.url ?? s.image.ar[0]?.url

          return (
            <div key={s._id} className="list-group-item d-flex align-items-center gap-3">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div className="bg-light rounded" style={{ width: 48, height: 48 }} />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">{s.name.en}</div>
                <div className="small text-muted" dir="rtl" lang="ar">
                  {s.name.ar}
                </div>
                <div className="small text-muted">
                  Order {s.order} · {s.items.length} items · icon: {s.icon}
                </div>
              </div>

              <ServiceDrawer service={s} nextOrder={nextOrder} />

              <button type="button" className="btn btn-soft-danger" onClick={() => remove(s._id, s.name.en)} aria-label="Delete service">
                <IconifyIcon icon="solar:trash-bin-trash-broken" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WhatWeDoAdminPage
