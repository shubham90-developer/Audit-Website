/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateOfficeMutation, useUpdateOfficeMutation } from '@/store/numbersPresenceApi'
import type { NumbersOffice, OfficeFiles } from '@/store/numbersPresenceApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2

type Draft = {
  city: Localized
  country: Localized
  flagCode: string
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  city: { en: '', ar: '' },
  country: { en: '', ar: '' },
  flagCode: '',
  order: String(nextOrder),
})

const toDraft = (o: NumbersOffice | undefined, nextOrder: number): Draft =>
  o
    ? {
        city: { ...o.city },
        country: { ...o.country },
        flagCode: o.flagCode,
        order: String(o.order),
      }
    : emptyDraft(nextOrder)

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { office?: NumbersOffice; nextOrder: number }

const OfficeDrawer = ({ office, nextOrder }: Props) => {
  const isEdit = Boolean(office)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(office, nextOrder))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<OfficeFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const [createOffice, { isLoading: creating }] = useCreateOfficeMutation()
  const [updateOffice, { isLoading: updating }] = useUpdateOfficeMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(office, nextOrder))
    setRemoveIds([])
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'city' | 'country', code: Lang, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

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
      if (draft.city[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} city`)
        return
      }
      if (draft.country[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} country`)
        return
      }
    }

    if (!/^[a-zA-Z]{2}$/.test(draft.flagCode.trim())) {
      toast.error('Flag code must be 2 letters, e.g. ae')
      return
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data = {
      city: trimLocalized(draft.city),
      country: trimLocalized(draft.country),
      flagCode: draft.flagCode.trim().toLowerCase(),
      order: orderNumber,
    }

    try {
      if (office) {
        await updateOffice({ id: office._id, data, files, removePublicIds: removeIds }).unwrap()
      } else {
        await createOffice({ data, files }).unwrap()
      }
      toast.success(isEdit ? 'Office updated' : 'Office added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit office">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add office
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
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Office' : 'Add Office'}</h5>
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
            {/* SHARED FIELDS */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-semibold small">Flag code (2 letters, e.g. ae)</label>
                <input
                  type="text"
                  maxLength={2}
                  className={`form-control form-control-sm ${showErrors && !/^[a-zA-Z]{2}$/.test(draft.flagCode.trim()) ? 'is-invalid' : ''}`}
                  value={draft.flagCode}
                  onChange={(e) => setDraft((p) => ({ ...p, flagCode: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
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
            </div>

            {/* CITY and COUNTRY, English and Arabic side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const cityInvalid = showErrors && draft.city[code].trim().length < MIN_LENGTH
                const countryInvalid = showErrors && draft.country[code].trim().length < MIN_LENGTH

                return (
                  <div className="col-6" key={code}>
                    <div className="fw-semibold small mb-2">{name}</div>

                    <label className="form-label small mb-1">City</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-2 ${cityInvalid ? 'is-invalid' : ''}`}
                      value={draft.city[code]}
                      onChange={(e) => setLocalized('city', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <label className="form-label small mb-1">Country</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm ${countryInvalid ? 'is-invalid' : ''}`}
                      value={draft.country[code]}
                      onChange={(e) => setLocalized('country', code, e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )
              })}
            </div>

            {/* IMAGES: per language */}
            <div className="fw-semibold small mt-4 mb-2">Office image</div>
            <div className="row g-3">
              {LANGS.map(({ code, name }) => {
                const existing = office?.image[code] ?? []

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
                            id={`offRm-${office?._id}-${code}-${m.publicId}`}
                            checked={removeIds.includes(m.publicId)}
                            onChange={() => toggleRemove(m.publicId)}
                            disabled={isLoading}
                          />
                          <label className="form-check-label small" htmlFor={`offRm-${office?._id}-${code}-${m.publicId}`}>
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

export default OfficeDrawer
