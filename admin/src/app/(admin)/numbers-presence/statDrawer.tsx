'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { STAT_ICON_OPTIONS, STAT_COLOR_OPTIONS, useCreateStatMutation, useUpdateStatMutation } from '@/store/numbersPresenceApi'
import type { NumbersStat, StatColor, StatIcon } from '@/store/numbersPresenceApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const MIN_LENGTH = 2

type Draft = {
  icon: StatIcon
  color: StatColor
  value: string
  suffix: string
  label: Localized
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  icon: 'users',
  color: 'violet',
  value: '',
  suffix: '+',
  label: { en: '', ar: '' },
  order: String(nextOrder),
})

const toDraft = (s: NumbersStat | undefined, nextOrder: number): Draft =>
  s
    ? {
        icon: s.icon,
        color: s.color,
        value: String(s.value),
        suffix: s.suffix,
        label: { ...s.label },
        order: String(s.order),
      }
    : emptyDraft(nextOrder)

type Props = { stat?: NumbersStat; nextOrder: number }

const StatDrawer = ({ stat, nextOrder }: Props) => {
  const isEdit = Boolean(stat)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(stat, nextOrder))
  const [showErrors, setShowErrors] = useState(false)

  const [createStat, { isLoading: creating }] = useCreateStatMutation()
  const [updateStat, { isLoading: updating }] = useUpdateStatMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(stat, nextOrder))
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

    const valueNumber = Number(draft.value)
    if (draft.value.trim() === '' || Number.isNaN(valueNumber) || valueNumber < 0 || valueNumber > 1000000) {
      toast.error('Value must be a number between 0 and 1,000,000')
      return
    }

    if (draft.suffix.trim().length > 5) {
      toast.error('Suffix can be at most 5 characters')
      return
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data = {
      icon: draft.icon,
      color: draft.color,
      value: valueNumber,
      suffix: draft.suffix.trim(),
      label: { en: draft.label.en.trim(), ar: draft.label.ar.trim() },
      order: orderNumber,
    }

    try {
      if (stat) {
        await updateStat({ id: stat._id, data }).unwrap()
      } else {
        await createStat(data).unwrap()
      }
      toast.success(isEdit ? 'Stat updated' : 'Stat added')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit stat">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add stat
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
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Stat' : 'Add Stat'}</h5>
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
                <label className="form-label fw-semibold small">Value</label>
                <input
                  type="number"
                  min={0}
                  className={`form-control form-control-sm ${showErrors && draft.value.trim() === '' ? 'is-invalid' : ''}`}
                  value={draft.value}
                  onChange={(e) => setDraft((p) => ({ ...p, value: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Suffix (e.g. + or %)</label>
                <input
                  type="text"
                  maxLength={5}
                  className="form-control form-control-sm"
                  value={draft.suffix}
                  onChange={(e) => setDraft((p) => ({ ...p, suffix: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Icon</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as StatIcon }))}
                  disabled={isLoading}>
                  {STAT_ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Color</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.color}
                  onChange={(e) => setDraft((p) => ({ ...p, color: e.target.value as StatColor }))}
                  disabled={isLoading}>
                  {STAT_COLOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
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

export default StatDrawer
