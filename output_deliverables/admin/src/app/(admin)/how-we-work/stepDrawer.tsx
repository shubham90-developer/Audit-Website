'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { STEP_ICON_OPTIONS, useCreateStepMutation, useUpdateStepMutation } from '@/store/howWeWorkApi'
import type { HowWeWorkStep, StepIcon } from '@/store/howWeWorkApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const MIN_LENGTH = 2

type Draft = {
  title: Localized
  desc: Localized
  icon: StepIcon
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  title: { en: '', ar: '' },
  desc: { en: '', ar: '' },
  icon: 'headset',
  order: String(nextOrder),
})

const toDraft = (s: HowWeWorkStep | undefined, nextOrder: number): Draft =>
  s
    ? {
        title: { ...s.title },
        desc: { ...s.desc },
        icon: s.icon,
        order: String(s.order),
      }
    : emptyDraft(nextOrder)

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { step?: HowWeWorkStep; nextOrder: number }

const StepDrawer = ({ step, nextOrder }: Props) => {
  const isEdit = Boolean(step)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(step, nextOrder))
  const [showErrors, setShowErrors] = useState(false)

  const [createStep, { isLoading: creating }] = useCreateStepMutation()
  const [updateStep, { isLoading: updating }] = useUpdateStepMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(step, nextOrder))
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'title' | 'desc', code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

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
      title: trimLocalized(draft.title),
      desc: trimLocalized(draft.desc),
      icon: draft.icon,
      order: orderNumber,
    }

    try {
      if (step) {
        await updateStep({ id: step._id, data }).unwrap()
      } else {
        await createStep(data).unwrap()
      }
      toast.success(isEdit ? 'Step updated' : 'Step added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit step">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add step
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
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Step' : 'Add Step'}</h5>
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
                <small className="text-muted">The “STEP 1.” label follows this order.</small>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Icon</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as StepIcon }))}
                  disabled={isLoading}>
                  {STEP_ICON_OPTIONS.map((o) => (
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

export default StepDrawer
