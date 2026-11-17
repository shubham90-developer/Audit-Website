/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { INDUSTRY_ICON_OPTIONS, useCreateIndustryMutation, useUpdateIndustryMutation } from '@/store/industriesApi'
import type { Industry, IndustryFiles, IndustryIcon } from '@/store/industriesApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2

type Draft = {
  icon: IndustryIcon
  title: Localized
  desc: Localized
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  icon: 'building',
  title: { en: '', ar: '' },
  desc: { en: '', ar: '' },
  order: String(nextOrder),
})

const toDraft = (i: Industry | undefined, nextOrder: number): Draft =>
  i
    ? {
        icon: i.icon,
        title: { ...i.title },
        desc: { ...i.desc },
        order: String(i.order),
      }
    : emptyDraft(nextOrder)

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { industry?: Industry; nextOrder: number }

const IndustryDrawer = ({ industry, nextOrder }: Props) => {
  const isEdit = Boolean(industry)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(industry, nextOrder))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<IndustryFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const [createIndustry, { isLoading: creating }] = useCreateIndustryMutation()
  const [updateIndustry, { isLoading: updating }] = useUpdateIndustryMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(industry, nextOrder))
    setRemoveIds([])
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'title' | 'desc', code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const toggleRemove = (publicId: string) =>
    setRemoveIds((prev) => (prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]))

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowErrors(true)

    for (const { code, name } of LANGS) {
      if (draft.title[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} title`)
        return
      }
      if (draft.desc[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} description`)
        return
      }
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data = {
      icon: draft.icon,
      title: trimLocalized(draft.title),
      desc: trimLocalized(draft.desc),
      order: orderNumber,
    }

    try {
      if (industry) {
        await updateIndustry({ id: industry._id, data, files, removePublicIds: removeIds }).unwrap()
      } else {
        await createIndustry({ data, files }).unwrap()
      }
      toast.success(isEdit ? 'Industry updated' : 'Industry added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit industry">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add industry
        </button>
      )}

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '600px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Industry' : 'Add Industry'}</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}
            aria-label="Close drawer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-3">
            {/* ORDER and ICON: shared */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-semibold small">Display order</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-control form-control-sm"
                  value={draft.order}
                  onChange={(e) => setDraft((p) => ({ ...p, order: e.target.value }))}
                  disabled={isLoading}
                />
                <small className="text-muted">The “01” number follows this order.</small>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Icon</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as IndustryIcon }))}
                  disabled={isLoading}>
                  {INDUSTRY_ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TITLE and DESCRIPTION, English and Arabic side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const titleInvalid = showErrors && draft.title[code].trim().length < MIN_LENGTH
                const descInvalid = showErrors && draft.desc[code].trim().length < MIN_LENGTH

                return (
                  <div className="col-6" key={code}>
                    <div className="fw-semibold small mb-2">{name}</div>

                    <label className="form-label small mb-1">Title</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-2 ${titleInvalid ? 'is-invalid' : ''}`}
                      value={draft.title[code]}
                      onChange={(e) => setLocalized('title', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <label className="form-label small mb-1">Description</label>
                    <textarea
                      rows={5}
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm ${descInvalid ? 'is-invalid' : ''}`}
                      value={draft.desc[code]}
                      onChange={(e) => setLocalized('desc', code, e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )
              })}
            </div>

            {/* IMAGES: per language */}
            <div className="fw-semibold small mt-4 mb-2">Card image (right side)</div>
            <div className="row g-3">
              {LANGS.map(({ code, name }) => {
                const existing = industry?.image[code] ?? []

                return (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>

                    {existing.map((m) => (
                      <div key={m.publicId} className="d-flex align-items-center gap-2 mb-2">
                        <img src={m.url} alt="" width={64} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`indRm-${industry?._id}-${code}-${m.publicId}`}
                            checked={removeIds.includes(m.publicId)}
                            onChange={() => toggleRemove(m.publicId)}
                            disabled={isLoading}
                          />
                          <label className="form-check-label small" htmlFor={`indRm-${industry?._id}-${code}-${m.publicId}`}>
                            Remove
                          </label>
                        </div>
                      </div>
                    ))}

                    <input
                      key={`${fileKey}-${code}`}
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => handleImage(code, e)}
                      disabled={isLoading}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default IndustryDrawer
