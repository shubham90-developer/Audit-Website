/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { ICON_OPTIONS, useCreateServiceMutation, useUpdateServiceMutation } from '@/store/whatWeDoApi'
import type { IconKey, ServiceFiles, WhatWeDoService } from '@/store/whatWeDoApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2

type Draft = {
  name: Localized
  desc: Localized
  icon: IconKey
  items: Localized[]
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  name: { en: '', ar: '' },
  desc: { en: '', ar: '' },
  icon: 'briefcase',
  items: [],
  order: String(nextOrder),
})

const toDraft = (s: WhatWeDoService | undefined, nextOrder: number): Draft =>
  s
    ? {
        name: { ...s.name },
        desc: { ...s.desc },
        icon: s.icon,
        items: s.items.map((i) => ({ ...i })),
        order: String(s.order),
      }
    : emptyDraft(nextOrder)

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { service?: WhatWeDoService; nextOrder: number }

const ServiceDrawer = ({ service, nextOrder }: Props) => {
  const isEdit = Boolean(service)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(service, nextOrder))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<ServiceFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const [createService, { isLoading: creating }] = useCreateServiceMutation()
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(service, nextOrder))
    setRemoveIds([])
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'name' | 'desc', code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const setItem = (index: number, code: Lang, value: string) =>
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [code]: value } : item)),
    }))

  const addItem = () => setDraft((prev) => ({ ...prev, items: [...prev.items, { en: '', ar: '' }] }))

  const removeItem = (index: number) => setDraft((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))

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
      if (draft.name[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} service name`)
        return
      }
      if (draft.desc[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} description`)
        return
      }
    }

    for (const item of draft.items) {
      if (!item.en.trim() || !item.ar.trim()) {
        toast.error('Each item needs an English and an Arabic value, or remove it')
        return
      }
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data = {
      name: trimLocalized(draft.name),
      desc: trimLocalized(draft.desc),
      icon: draft.icon,
      items: draft.items.map(trimLocalized),
      order: orderNumber,
    }

    try {
      if (service) {
        await updateService({ id: service._id, data, files, removePublicIds: removeIds }).unwrap()
      } else {
        await createService({ data, files }).unwrap()
      }
      toast.success(isEdit ? 'Service updated' : 'Service added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit service">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add service
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
          width: '560px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Service' : 'Add Service'}</h5>
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
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Icon</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as IconKey }))}
                  disabled={isLoading}>
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NAME and DESCRIPTION, English and Arabic side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const nameInvalid = showErrors && draft.name[code].trim().length < MIN_LENGTH
                const descInvalid = showErrors && draft.desc[code].trim().length < MIN_LENGTH

                return (
                  <div className="col-6" key={code}>
                    <div className="fw-semibold small mb-2">{name}</div>

                    <label className="form-label small mb-1">Name</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-2 ${nameInvalid ? 'is-invalid' : ''}`}
                      value={draft.name[code]}
                      onChange={(e) => setLocalized('name', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <label className="form-label small mb-1">Description</label>
                    <textarea
                      rows={4}
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

            {/* ITEMS: one row per item, English | Arabic */}
            <div className="mt-4 mb-4">
              <div className="fw-semibold small mb-2">Items</div>
              {draft.items.map((item, i) => (
                <div className="row g-2 mb-2 align-items-center" key={i}>
                  <div className="col-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="English"
                      value={item.en}
                      onChange={(e) => setItem(i, 'en', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-5">
                    <input
                      type="text"
                      dir="rtl"
                      lang="ar"
                      className="form-control form-control-sm"
                      placeholder="Arabic"
                      value={item.ar}
                      onChange={(e) => setItem(i, 'ar', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-2">
                    <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeItem(i)} disabled={isLoading}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-light" onClick={addItem} disabled={isLoading}>
                + Add item
              </button>
            </div>

            {/* IMAGES: per language */}
            <div className="fw-semibold small mb-2">Panel image</div>
            <div className="row g-3">
              {LANGS.map(({ code, name }) => {
                const existing = service?.image[code] ?? []

                return (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>

                    {existing.map((m) => (
                      <div key={m.publicId} className="d-flex align-items-center gap-2 mb-2">
                        <img src={m.url} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`svcRm-${service?._id}-${code}-${m.publicId}`}
                            checked={removeIds.includes(m.publicId)}
                            onChange={() => toggleRemove(m.publicId)}
                            disabled={isLoading}
                          />
                          <label className="form-check-label small" htmlFor={`svcRm-${service?._id}-${code}-${m.publicId}`}>
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

export default ServiceDrawer
