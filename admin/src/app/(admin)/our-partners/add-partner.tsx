/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreatePartnerMutation } from '@/store/partnerApi'
import type { PartnerLogoFiles } from '@/store/partnerApi'
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
const EMPTY_TEXTS: Texts = {
  title: { en: '', ar: '' },
  text: { en: '', ar: '' },
}

type Props = { nextOrder: number }

const AddPartnerDrawer = ({ nextOrder }: Props) => {
  const [open, setOpen] = useState(false)
  const [createPartner, { isLoading }] = useCreatePartnerMutation()

  const [texts, setTexts] = useState<Texts>(EMPTY_TEXTS)
  const [order, setOrder] = useState<string>('')
  const [files, setFiles] = useState<PartnerLogoFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const openDrawer = () => {
    setTexts(EMPTY_TEXTS)
    setOrder(String(nextOrder))
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: TextKey, code: Lang, value: string) => {
    setTexts((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))
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

    for (const { code, name } of LANGS) {
      for (const { key, label } of FIELDS) {
        if (texts[key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please enter the ${name} ${label.toLowerCase()} (at least ${MIN_LENGTH} characters)`)
          return
        }
      }
    }

    const orderNumber = order.trim() === '' ? nextOrder : Number(order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    try {
      await createPartner({
        data: {
          title: { en: texts.title.en.trim(), ar: texts.title.ar.trim() },
          text: { en: texts.text.en.trim(), ar: texts.text.ar.trim() },
          order: orderNumber,
        },
        files,
      }).unwrap()

      toast.success('Partner added successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add partner
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
          <h5 className="mb-0 fw-bold">Add Partner</h5>
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
            {/* ORDER */}
            <div className="mb-4">
              <label htmlFor="addPartnerOrder" className="form-label fw-semibold">
                Display order
              </label>
              <input
                id="addPartnerOrder"
                type="number"
                min={0}
                step={1}
                className="form-control form-control-sm"
                style={{ width: 120 }}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                disabled={isLoading}
              />
              <small className="text-muted">Leave as is to add it at the end.</small>
            </div>

            {/* ENGLISH and ARABIC side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => (
                <div className="col-6" key={code}>
                  <div className="fw-semibold small mb-2">{name}</div>

                  {FIELDS.map(({ key, label }) => {
                    const id = `addPartner-${key}-${code}`
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

                  <div className="mt-3">
                    <div className="small text-muted mb-1">Logo (optional)</div>
                    <input
                      key={`${fileKey}-${code}`}
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => handleLogo(code, e)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
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

export default AddPartnerDrawer
