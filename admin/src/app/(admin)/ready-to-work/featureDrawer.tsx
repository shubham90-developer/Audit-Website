'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FEATURE_ICON_OPTIONS, useCreateFeatureMutation, useUpdateFeatureMutation } from '@/store/readytoworkapi'
import type { FeatureIcon, ReadyToWorkFeature } from '@/store/readytoworkapi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const MIN_LENGTH = 2

type Draft = {
  icon: FeatureIcon
  label: Localized
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  icon: 'users',
  label: { en: '', ar: '' },
  order: String(nextOrder),
})

const toDraft = (f: ReadyToWorkFeature | undefined, nextOrder: number): Draft =>
  f
    ? {
        icon: f.icon,
        label: { ...f.label },
        order: String(f.order),
      }
    : emptyDraft(nextOrder)

type Props = { feature?: ReadyToWorkFeature; nextOrder: number }

const FeatureDrawer = ({ feature, nextOrder }: Props) => {
  const isEdit = Boolean(feature)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(feature, nextOrder))
  const [showErrors, setShowErrors] = useState(false)

  const [createFeature, { isLoading: creating }] = useCreateFeatureMutation()
  const [updateFeature, { isLoading: updating }] = useUpdateFeatureMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(feature, nextOrder))
    setShowErrors(false)
    setOpen(true)
  }

  const setLabel = (code: Lang, value: string) => setDraft((prev) => ({ ...prev, label: { ...prev.label, [code]: value } }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowErrors(true)

    for (const { code, name } of LANGS) {
      if (draft.label[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} label`)
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
      label: { en: draft.label.en.trim(), ar: draft.label.ar.trim() },
      order: orderNumber,
    }

    try {
      if (feature) {
        await updateFeature({ id: feature._id, data }).unwrap()
      } else {
        await createFeature(data).unwrap()
      }
      toast.success(isEdit ? 'Card updated' : 'Card added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit card">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add card
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
          width: '480px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Card' : 'Add Card'}</h5>
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
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as FeatureIcon }))}
                  disabled={isLoading}>
                  {FEATURE_ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LABEL, English and Arabic side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const invalid = showErrors && draft.label[code].trim().length < MIN_LENGTH

                return (
                  <div className="col-6" key={code}>
                    <label className="form-label fw-semibold small mb-1">Label ({name})</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm ${invalid ? 'is-invalid' : ''}`}
                      value={draft.label[code]}
                      onChange={(e) => setLabel(code, e.target.value)}
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

export default FeatureDrawer
