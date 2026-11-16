/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdatePartnerMutation } from '@/store/partnerApi'
import type { Partner, PartnerLogoFiles } from '@/store/partnerApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
type TextKey = 'title' | 'text'
type Texts = Record<TextKey, Localized>

const FIELDS: { key: TextKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'text', label: 'Text' },
]

const LOGO_FIELD = { en: 'logoEn', ar: 'logoAr' } as const
const MIN_LENGTH = 2

const flatten = (p: Partner): Texts => ({ title: p.title, text: p.text })

const EditPartnerDrawer = ({ item }: { item: Partner }) => {
  const [open, setOpen] = useState(false)
  const [updatePartner, { isLoading }] = useUpdatePartnerMutation()

  const [texts, setTexts] = useState<Texts>(() => flatten(item))
  const [order, setOrder] = useState<string>(() => String(item.order))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<PartnerLogoFiles>({})
  const [fileKey, setFileKey] = useState(0) // remounts file inputs on open
  const [showErrors, setShowErrors] = useState(false)

  // Always start from the latest saved values when the drawer opens
  const openDrawer = () => {
    setTexts(flatten(item))
    setOrder(String(item.order))
    setRemoveIds([])
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: TextKey, code: Lang, value: string) => {
    setTexts((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))
  }

  const toggleRemove = (publicId: string) => {
    setRemoveIds((prev) => (prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]))
  }

  const handleLogo = (code: Lang, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [LOGO_FIELD[code]]: file }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowErrors(true)

    // Both languages, every text field
    for (const { code, name } of LANGS) {
      for (const { key, label } of FIELDS) {
        if (texts[key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please enter the ${name} ${label.toLowerCase()} (at least ${MIN_LENGTH} characters)`)
          return
        }
      }
    }

    const orderNumber = Number(order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    try {
      await updatePartner({
        id: item._id,
        data: {
          title: { en: texts.title.en.trim(), ar: texts.title.ar.trim() },
          text: { en: texts.text.en.trim(), ar: texts.text.ar.trim() },
          order: orderNumber,
        },
        files,
        removePublicIds: removeIds,
      }).unwrap()

      toast.success('Partner updated successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={openDrawer} aria-label="Edit partner">
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

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
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Partner</h5>
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
            {/* ORDER: shared by both languages */}
            <div className="mb-4">
              <label htmlFor={`editPartnerOrder-${item._id}`} className="form-label fw-semibold">
                Display order
              </label>
              <input
                id={`editPartnerOrder-${item._id}`}
                type="number"
                min={0}
                step={1}
                className="form-control form-control-sm"
                style={{ width: 120 }}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* ENGLISH and ARABIC side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const existing = item.logo[code]

                return (
                  <div className="col-6" key={code}>
                    <div className="fw-semibold small mb-2">{name}</div>

                    {FIELDS.map(({ key, label }) => {
                      const id = `editPartner-${item._id}-${key}-${code}`
                      const value = texts[key][code]
                      const invalid = showErrors && value.trim().length < MIN_LENGTH

                      return (
                        <div className="mb-2" key={key}>
                          <label htmlFor={id} className="form-label small mb-1">
                            {label}
                          </label>
                          <input
                            id={id}
                            type="text"
                            dir={dir}
                            lang={code}
                            className={`form-control form-control-sm ${invalid ? 'is-invalid' : ''}`}
                            value={value}
                            onChange={(e) => setLocalized(key, code, e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      )
                    })}

                    {/* LOGO for this language */}
                    <div className="mt-3">
                      <div className="small text-muted mb-1">Logo</div>

                      {existing.map((m) => (
                        <div key={m.publicId} className="d-flex align-items-center gap-2 mb-2">
                          <img src={m.url} alt="" width={48} height={48} style={{ objectFit: 'contain' }} />
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`editPartnerRm-${item._id}-${code}-${m.publicId}`}
                              checked={removeIds.includes(m.publicId)}
                              onChange={() => toggleRemove(m.publicId)}
                              disabled={isLoading}
                            />
                            <label className="form-check-label small" htmlFor={`editPartnerRm-${item._id}-${code}-${m.publicId}`}>
                              Remove
                            </label>
                          </div>
                        </div>
                      ))}

                      {existing.length === 0 && <div className="small text-muted mb-1">No logo</div>}

                      <input
                        key={`${fileKey}-${code}`}
                        type="file"
                        accept="image/*"
                        className="form-control form-control-sm"
                        onChange={(e) => handleLogo(code, e)}
                        disabled={isLoading}
                      />
                      <small className="text-muted d-block mt-1">Tick Remove on the old logo before uploading a replacement.</small>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditPartnerDrawer
