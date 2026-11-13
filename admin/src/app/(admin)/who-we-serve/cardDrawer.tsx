/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateCardMutation, useUpdateCardMutation } from '@/store/whoWeServeApi'
import type { CardFiles, CardKind, WhoWeServeCard } from '@/store/whoWeServeApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2

type Draft = { title: Localized; text: Localized; order: string }

const toDraft = (c: WhoWeServeCard | undefined, nextOrder: number): Draft =>
  c
    ? { title: { ...c.title }, text: { ...c.text }, order: String(c.order) }
    : { title: { en: '', ar: '' }, text: { en: '', ar: '' }, order: String(nextOrder) }

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

const KIND_LABEL: Record<CardKind, string> = {
  serve: 'serve card',
  why: 'why card',
}

type Props = { kind: CardKind; card?: WhoWeServeCard; nextOrder: number }

const CardDrawer = ({ kind, card, nextOrder }: Props) => {
  const isEdit = Boolean(card)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(card, nextOrder))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<CardFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const [createCard, { isLoading: creating }] = useCreateCardMutation()
  const [updateCard, { isLoading: updating }] = useUpdateCardMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(card, nextOrder))
    setRemoveIds([])
    setFiles({})
    setFileKey((k) => k + 1)
    setShowErrors(false)
    setOpen(true)
  }

  const setLocalized = (key: 'title' | 'text', code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

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
      if (draft.text[code].trim().length < MIN_LENGTH) {
        toast.error(`Please enter the ${name} text`)
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
      text: trimLocalized(draft.text),
      order: orderNumber,
    }

    try {
      if (card) {
        await updateCard({ id: card._id, data, files, removePublicIds: removeIds }).unwrap()
      } else {
        await createCard({ data: { kind, ...data }, files }).unwrap()
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
          Add {KIND_LABEL[kind]}
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
          <h5 className="mb-0 fw-bold">
            {isEdit ? 'Edit' : 'Add'} {KIND_LABEL[card?.kind ?? kind]}
          </h5>
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
            <div className="mb-4">
              <label htmlFor={`cardOrder-${card?._id ?? kind}`} className="form-label fw-semibold small">
                Display order
              </label>
              <input
                id={`cardOrder-${card?._id ?? kind}`}
                type="number"
                min={0}
                step={1}
                className="form-control form-control-sm"
                style={{ width: 120 }}
                value={draft.order}
                onChange={(e) => setDraft((p) => ({ ...p, order: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => {
                const titleInvalid = showErrors && draft.title[code].trim().length < MIN_LENGTH
                const textInvalid = showErrors && draft.text[code].trim().length < MIN_LENGTH
                const existing = card?.image[code] ?? []

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

                    <label className="form-label small mb-1">Text</label>
                    <textarea
                      rows={5}
                      dir={dir}
                      lang={code}
                      className={`form-control form-control-sm mb-3 ${textInvalid ? 'is-invalid' : ''}`}
                      value={draft.text[code]}
                      onChange={(e) => setLocalized('text', code, e.target.value)}
                      disabled={isLoading}
                    />

                    <div className="small text-muted mb-1">Image</div>
                    {existing.map((m) => (
                      <div key={m.publicId} className="d-flex align-items-center gap-2 mb-2">
                        <img src={m.url} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`cardRm-${card?._id}-${code}-${m.publicId}`}
                            checked={removeIds.includes(m.publicId)}
                            onChange={() => toggleRemove(m.publicId)}
                            disabled={isLoading}
                          />
                          <label className="form-check-label small" htmlFor={`cardRm-${card?._id}-${code}-${m.publicId}`}>
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

export default CardDrawer
