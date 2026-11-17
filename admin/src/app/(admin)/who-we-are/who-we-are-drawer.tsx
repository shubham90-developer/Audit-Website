'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { WHO_ICON_OPTIONS, useCreateWhoWeAreItemMutation, useUpdateWhoWeAreItemMutation } from '@/store/whoWeAreApi'
import type { ItemText, WhoIcon, WhoWeAreItem } from '@/store/whoWeAreApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

type Draft = {
  icon: WhoIcon
  order: string
  label: Localized
  value: Localized
  note: Localized
}

const emptyLocalized: Localized = { en: '', ar: '' }

const toDraft = (item: WhoWeAreItem | undefined, nextOrder: number): Draft =>
  item
    ? {
        icon: item.icon,
        order: String(item.order),
        label: { ...item.label },
        value: { ...item.value },
        note: { ...(item.note ?? emptyLocalized) },
      }
    : {
        icon: 'award',
        order: String(nextOrder),
        label: { ...emptyLocalized },
        value: { ...emptyLocalized },
        note: { ...emptyLocalized },
      }

const trim = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { item?: WhoWeAreItem; nextOrder: number }

// Add or edit one Firm Snapshot card
const ItemDrawer = ({ item, nextOrder }: Props) => {
  const isEdit = Boolean(item)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(item, nextOrder))
  const [showErrors, setShowErrors] = useState(false)

  const [createItem, { isLoading: creating }] = useCreateWhoWeAreItemMutation()
  const [updateItem, { isLoading: updating }] = useUpdateWhoWeAreItemMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(item, nextOrder))
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'label' | 'value' | 'note', code: Lang, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowErrors(true)

    for (const { code, name } of LANGS) {
      if (!draft.label[code].trim()) {
        toast.error(`Please enter the ${name} label`)
        return
      }
      if (!draft.value[code].trim()) {
        toast.error(`Please enter the ${name} value`)
        return
      }
      if (draft.note[code].trim().length > 300) {
        toast.error(`The ${name} note is too long (max 300 characters)`)
        return
      }
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)
    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data: ItemText = {
      icon: draft.icon,
      order: orderNumber,
      label: trim(draft.label),
      value: trim(draft.value),
      note: trim(draft.note),
    }

    try {
      if (item) {
        await updateItem({ id: item._id, data }).unwrap()
      } else {
        await createItem(data).unwrap()
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
          width: '560px',
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
            {/* ICON and ORDER: shared */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-semibold small">Icon</label>
                <select
                  className="form-select form-select-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft((p) => ({ ...p, icon: e.target.value as WhoIcon }))}
                  disabled={isLoading}>
                  {WHO_ICON_OPTIONS.map((o) => (
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
                <small className="text-muted">Lower numbers appear first.</small>
              </div>
            </div>

            {/* LABEL, VALUE and NOTE, English and Arabic side by side */}
            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const labelInvalid = showErrors && !draft.label[code].trim()
                const valueInvalid = showErrors && !draft.value[code].trim()

                return (
                  <div className="col-6" key={code}>
                    <div className="fw-semibold small mb-2">{name}</div>

                    <label className="form-label small mb-1">Label</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-2 ${labelInvalid ? 'is-invalid' : ''}`}
                      value={draft.label[code]}
                      onChange={(e) => setLocalized('label', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <label className="form-label small mb-1">Value</label>
                    <textarea
                      rows={3}
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-2 ${valueInvalid ? 'is-invalid' : ''}`}
                      value={draft.value[code]}
                      onChange={(e) => setLocalized('value', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <label className="form-label small mb-1">Note (optional)</label>
                    <input
                      type="text"
                      dir={dir}
                      lang={code}
                      className="form-control form-control-sm"
                      value={draft.note[code]}
                      onChange={(e) => setLocalized('note', code, e.target.value)}
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

export default ItemDrawer
