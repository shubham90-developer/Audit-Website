'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateMarketMutation, useUpdateMarketMutation } from '@/store/globalMarketsApi'

import type { GlobalMarket, MarketFiles, MarketText } from '@/store/globalMarketsApi'

import type { Localized } from '@/store/bannerApi'

import ImagePicker from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

const IMAGE_FIELD = {
  en: 'marketImageEn',
  ar: 'marketImageAr',
} as const

type Draft = {
  title: Localized
  order: string
  isActive: boolean
}

const emptyDraft = (nextOrder: number): Draft => ({
  title: { en: '', ar: '' },
  order: String(nextOrder),
  isActive: true,
})

const toDraft = (market: GlobalMarket | undefined, nextOrder: number): Draft =>
  market
    ? {
        title: { ...market.title },
        order: String(market.order),
        isActive: market.isActive,
      }
    : emptyDraft(nextOrder)

const trimLocalized = (value: Localized): Localized => ({
  en: value.en.trim(),
  ar: value.ar.trim(),
})

type Props = {
  market?: GlobalMarket
  nextOrder: number
}

const MarketDrawer = ({ market, nextOrder }: Props) => {
  const isEdit = Boolean(market)

  const [open, setOpen] = useState(false)

  const [draft, setDraft] = useState<Draft>(() => toDraft(market, nextOrder))

  const [files, setFiles] = useState<MarketFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [createMarket, { isLoading: creating }] = useCreateMarketMutation()

  const [updateMarket, { isLoading: updating }] = useUpdateMarketMutation()

  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(market, nextOrder))
    setFiles({})
    setPickerKey((k) => k + 1)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    for (const { code, name } of LANGS) {
      if (!draft.title[code].trim()) {
        toast.error(`Please enter ${name} country name`)
        return
      }
    }

    const orderNumber = draft.order.trim() === '' ? nextOrder : Number(draft.order)

    if (!Number.isInteger(orderNumber) || orderNumber < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data: MarketText = {
      title: trimLocalized(draft.title),
      order: orderNumber,
      isActive: draft.isActive,
    }

    try {
      if (market) {
        await updateMarket({
          id: market._id,
          data,
          files,
        }).unwrap()
      } else {
        await createMarket({
          data,
          files,
        }).unwrap()
      }

      toast.success(isEdit ? 'Country updated successfully' : 'Country added successfully')

      setFiles({})
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}

      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit country">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add country
        </button>
      )}

      {/* OVERLAY */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => !isLoading && setOpen(false)}
        />
      )}

      {/* DRAWER */}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '700px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
          visibility: open ? 'visible' : 'hidden',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Country' : 'Add Country'}</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}
            disabled={isLoading}
            aria-label="Close drawer">
            ✕
          </button>
        </div>

        {open && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-3">
              {/* COUNTRY NAME */}

              <div className="fw-semibold small mb-2">Country name</div>

              <div className="row g-2 mb-4">
                {LANGS.map(({ code, name, dir }) => (
                  <div className="col-6" key={code}>
                    <label className="small text-muted mb-1">{name}</label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      dir={dir}
                      lang={code}
                      value={draft.title[code]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          title: {
                            ...prev.title,
                            [code]: e.target.value,
                          },
                        }))
                      }
                      disabled={isLoading}
                      placeholder={`Enter ${name} name`}
                    />
                  </div>
                ))}
              </div>

              {/* DISPLAY ORDER */}

              <div className="mb-4" style={{ maxWidth: 200 }}>
                <label className="form-label fw-semibold small">Display order</label>

                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-control form-control-sm"
                  value={draft.order}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      order: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />

                <small className="text-muted">Lower numbers appear first.</small>
              </div>

              {/* ACTIVE STATUS */}

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="marketActive"
                  checked={draft.isActive}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={isLoading}
                />

                <label className="form-check-label fw-semibold small" htmlFor="marketActive">
                  Active country
                </label>

                <div className="small text-muted">Inactive countries will not be displayed on the public website when filtered by isActive.</div>
              </div>

              {/* COUNTRY IMAGES */}

              <div className="fw-semibold small mb-2">Country card images</div>

              <div className="row g-3">
                {LANGS.map(({ code, name }) => (
                  <div className="col-6" key={code}>
                    <ImagePicker
                      label={`Country image (${name})`}
                      current={market?.image[code][0]}
                      disabled={isLoading}
                      pickerKey={`${pickerKey}-${code}`}
                      onPick={(file) =>
                        setFiles((prev) => ({
                          ...prev,
                          [IMAGE_FIELD[code]]: file,
                        }))
                      }
                    />
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
        )}
      </div>
    </>
  )
}

export default MarketDrawer
