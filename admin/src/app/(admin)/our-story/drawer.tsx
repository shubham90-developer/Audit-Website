'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import RichTextEditor from '@/components/RichTextEditor'
import { useCreateStepMutation, useUpdateStepMutation } from '@/store/ourStoryApi'
import type { OurStoryStep, StepFiles } from '@/store/ourStoryApi'
import type { Localized } from '@/store/bannerApi'
import ImagePicker from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const

// Strips tags to check whether an editor value has any visible text
const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

type Draft = {
  title: Localized
  text: Localized
  order: string
}

const emptyDraft = (nextOrder: number): Draft => ({
  title: { en: '', ar: '' },
  text: { en: '', ar: '' },
  order: String(nextOrder),
})

const toDraft = (s: OurStoryStep | undefined, nextOrder: number): Draft =>
  s
    ? {
        title: { ...s.title },
        text: { ...s.text },
        order: String(s.order),
      }
    : emptyDraft(nextOrder)

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

type Props = { step?: OurStoryStep; nextOrder: number }

const StepDrawer = ({ step, nextOrder }: Props) => {
  const isEdit = Boolean(step)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => toDraft(step, nextOrder))
  const [files, setFiles] = useState<StepFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [createStep, { isLoading: creating }] = useCreateStepMutation()
  const [updateStep, { isLoading: updating }] = useUpdateStepMutation()
  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(step, nextOrder))
    setFiles({})
    setPickerKey((k) => k + 1)
    setOpen(true)
  }

  const setLocalized = (key: 'title' | 'text', code: Lang, value: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    for (const { code, name } of LANGS) {
      if (!hasText(draft.title[code])) {
        toast.error(`Please enter the ${name} title`)
        return
      }
      if (!hasText(draft.text[code])) {
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
      if (step) {
        await updateStep({ id: step._id, data, files }).unwrap()
      } else {
        await createStep({ data, files }).unwrap()
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
          width: '760px',
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

        {/* The form is only mounted while open, so closed drawers do not keep text editors alive */}
        {open && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-3">
              <div className="mb-4" style={{ maxWidth: 200 }}>
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

              {/* TITLE: text editor, English and Arabic side by side */}
              <div className="fw-semibold small mb-1">Title</div>
              <div className="row g-2 mb-3">
                {LANGS.map(({ code, name, dir }) => (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>
                    <RichTextEditor
                      value={draft.title[code]}
                      onChange={(html) => setLocalized('title', code, html)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  </div>
                ))}
              </div>

              {/* TEXT: text editor, English and Arabic side by side */}
              <div className="fw-semibold small mb-1">Text</div>
              <div className="row g-2 mb-4">
                {LANGS.map(({ code, name, dir }) => (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>
                    <RichTextEditor
                      value={draft.text[code]}
                      onChange={(html) => setLocalized('text', code, html)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  </div>
                ))}
              </div>

              {/* IMAGES: per language */}
              <div className="fw-semibold small mb-2">Step image</div>
              <div className="row g-3">
                {LANGS.map(({ code, name }) => (
                  <div className="col-6" key={code}>
                    <ImagePicker
                      label={name}
                      current={step?.image[code][0]}
                      disabled={isLoading}
                      pickerKey={`${pickerKey}-${code}`}
                      onPick={(file) => setFiles((prev) => ({ ...prev, [IMAGE_FIELD[code]]: file }))}
                    />
                  </div>
                ))}
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
        )}
      </div>
    </>
  )
}

export default StepDrawer
