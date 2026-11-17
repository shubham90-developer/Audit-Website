'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import RichTextEditor from '@/components/RichTextEditor'

import { useCreateServiceMutation, useUpdateServiceMutation } from '@/store/servicesApi'

import type { IService, ServiceFiles, ServiceText } from '@/store/servicesApi'

import type { Localized } from '@/store/bannerApi'

import MediaPicker from './mediaPicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

// FIX: Restrict media keys to valid IService media properties.
type MediaKey = 'iconImg' | 'cardImg' | 'mainImg' | 'bgImage' | 'bgVideo'

type MediaField = {
  key: MediaKey
  label: string
  type: 'image' | 'video'
}

const mediaFields: MediaField[] = [
  { key: 'iconImg', label: 'Icon image', type: 'image' },
  { key: 'cardImg', label: 'Card image', type: 'image' },
  { key: 'mainImg', label: 'Main image', type: 'image' },
  { key: 'bgImage', label: 'Background image', type: 'image' },
  { key: 'bgVideo', label: 'Background video', type: 'video' },
]

type DetailDraft = {
  _id?: string
  title: Localized
  description: Localized
}

type Draft = {
  title: Localized
  desc: Localized
  details: DetailDraft[]
}

const emptyLocalized = (): Localized => ({
  en: '',
  ar: '',
})

const emptyDetail = (): DetailDraft => ({
  title: emptyLocalized(),
  description: emptyLocalized(),
})

const emptyDraft = (): Draft => ({
  title: emptyLocalized(),
  desc: emptyLocalized(),
  details: [],
})

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

type Props = {
  service?: IService
}

const ServiceDrawer = ({ service }: Props) => {
  const isEdit = Boolean(service)

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [files, setFiles] = useState<ServiceFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [createService, { isLoading: creating }] = useCreateServiceMutation()

  const [updateService, { isLoading: updating }] = useUpdateServiceMutation()

  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(
      service
        ? {
            title: { ...service.title },
            desc: { ...service.desc },
            details: service.details.map((item) => ({
              _id: item._id,
              title: { ...item.title },
              description: { ...item.description },
            })),
          }
        : emptyDraft(),
    )

    setFiles({})
    setPickerKey((k) => k + 1)
    setOpen(true)
  }

  const setLocalized = (key: 'title' | 'desc', lang: Lang, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }))
  }

  const setDetail = (index: number, key: 'title' | 'description', lang: Lang, value: string) => {
    setDraft((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) =>
        i === index
          ? {
              ...detail,
              [key]: {
                ...detail[key],
                [lang]: value,
              },
            }
          : detail,
      ),
    }))
  }

  const addDetail = () => {
    setDraft((prev) => ({
      ...prev,
      details: [...prev.details, emptyDetail()],
    }))
  }

  const removeDetail = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))

    // Rebuild indexed file names after removing a detail.
    setFiles((prev) => {
      const next: Record<string, File | undefined> = {
        ...prev,
      }

      delete next[`detailImageEn_${index}`]
      delete next[`detailImageAr_${index}`]

      LANGS.forEach(({ code }) => {
        for (let i = index + 1; i < draft.details.length; i++) {
          const oldKey = `detailImage${code === 'en' ? 'En' : 'Ar'}_${i}`

          const newKey = `detailImage${code === 'en' ? 'En' : 'Ar'}_${i - 1}`

          if (next[oldKey]) {
            next[newKey] = next[oldKey]
            delete next[oldKey]
          }
        }
      })

      return next as ServiceFiles
    })
  }

  const setMediaFile = (field: string, file?: File) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const validate = () => {
    for (const { code, name } of LANGS) {
      if (!hasText(draft.title[code])) {
        toast.error(`Please enter ${name} service title`)
        return false
      }

      if (!hasText(draft.desc[code])) {
        toast.error(`Please enter ${name} service description`)
        return false
      }
    }

    for (let i = 0; i < draft.details.length; i++) {
      for (const { code, name } of LANGS) {
        const detail = draft.details[i]

        if (!hasText(detail.title[code])) {
          toast.error(`Please enter ${name} title for detail ${i + 1}`)
          return false
        }

        if (!hasText(detail.description[code])) {
          toast.error(`Please enter ${name} description for detail ${i + 1}`)
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) return

    const data: ServiceText = {
      title: {
        en: draft.title.en.trim(),
        ar: draft.title.ar.trim(),
      },
      desc: {
        en: draft.desc.en.trim(),
        ar: draft.desc.ar.trim(),
      },
      details: draft.details.map((detail) => ({
        _id: detail._id,
        title: {
          en: detail.title.en.trim(),
          ar: detail.title.ar.trim(),
        },
        description: {
          en: detail.description.en.trim(),
          ar: detail.description.ar.trim(),
        },
      })),
    }

    try {
      if (service) {
        await updateService({
          id: service._id,
          data,
          files,
        }).unwrap()

        toast.success('Service updated successfully')
      } else {
        await createService({
          data,
          files,
        }).unwrap()

        toast.success('Service created successfully')
      }

      setOpen(false)
      setFiles({})
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer}>
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add service
        </button>
      )}

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

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: 850,
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Service' : 'Add Service'}</h5>

          <button type="button" className="btn btn-sm btn-danger" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {open && (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              {/* SERVICE TITLE */}

              <h6 className="fw-bold mb-2">Service title</h6>

              <div className="row g-2 mb-4">
                {LANGS.map(({ code, name, dir }) => (
                  <div className="col-6" key={code}>
                    <label className="form-label small">{name}</label>

                    <RichTextEditor
                      value={draft.title[code]}
                      onChange={(value) => setLocalized('title', code, value)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  </div>
                ))}
              </div>

              {/* DESCRIPTION */}

              <h6 className="fw-bold mb-2">Service description</h6>

              <div className="row g-2 mb-4">
                {LANGS.map(({ code, name, dir }) => (
                  <div className="col-6" key={code}>
                    <label className="form-label small">{name}</label>

                    <RichTextEditor
                      value={draft.desc[code]}
                      onChange={(value) => setLocalized('desc', code, value)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  </div>
                ))}
              </div>

              {/* MEDIA */}

              <h6 className="fw-bold mb-3">Service media</h6>

              {mediaFields.map(({ key, label, type }) => (
                <div className="card mb-3" key={key}>
                  <div className="card-body">
                    <h6 className="fw-semibold mb-3">{label}</h6>

                    <div className="row g-3">
                      {LANGS.map(({ code, name }) => (
                        <div className="col-6" key={code}>
                          <MediaPicker
                            label={name}
                            type={type}
                            current={service?.[key]?.[code]}
                            disabled={isLoading}
                            pickerKey={`${pickerKey}-${key}-${code}`}
                            onPick={(file) => setMediaFile(`${key}${code === 'en' ? 'En' : 'Ar'}`, file)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* DETAILS */}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Service details ({draft.details.length})</h6>

                <button type="button" className="btn btn-sm btn-soft-primary" onClick={addDetail} disabled={isLoading}>
                  <IconifyIcon icon="solar:add-circle-broken" />
                  Add detail
                </button>
              </div>

              {draft.details.map((detail, index) => (
                <div className="card mb-3" key={detail._id || index}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>Detail {index + 1}</strong>

                    <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => removeDetail(index)} disabled={isLoading}>
                      <IconifyIcon icon="solar:trash-bin-trash-broken" />
                    </button>
                  </div>

                  <div className="card-body">
                    <label className="form-label fw-semibold small">Detail title</label>

                    <div className="row g-2 mb-3">
                      {LANGS.map(({ code, name, dir }) => (
                        <div className="col-6" key={code}>
                          <small className="text-muted">{name}</small>

                          <RichTextEditor
                            value={detail.title[code]}
                            onChange={(value) => setDetail(index, 'title', code, value)}
                            disabled={isLoading}
                            dir={dir}
                            lang={code}
                          />
                        </div>
                      ))}
                    </div>

                    <label className="form-label fw-semibold small">Detail description</label>

                    <div className="row g-2 mb-3">
                      {LANGS.map(({ code, name, dir }) => (
                        <div className="col-6" key={code}>
                          <small className="text-muted">{name}</small>

                          <RichTextEditor
                            value={detail.description[code]}
                            onChange={(value) => setDetail(index, 'description', code, value)}
                            disabled={isLoading}
                            dir={dir}
                            lang={code}
                          />
                        </div>
                      ))}
                    </div>

                    <label className="form-label fw-semibold small">Detail images</label>

                    <div className="row g-3">
                      {LANGS.map(({ code, name }) => (
                        <div className="col-6" key={code}>
                          <MediaPicker
                            label={name}
                            type="image"
                            current={service?.details[index]?.img[code]}
                            disabled={isLoading}
                            pickerKey={`${pickerKey}-detail-${index}-${code}`}
                            onPick={(file) => setMediaFile(`detailImage${code === 'en' ? 'En' : 'Ar'}_${index}`, file)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                <IconifyIcon icon="solar:diskette-broken" />

                {isLoading ? 'Saving...' : 'Save service'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default ServiceDrawer
