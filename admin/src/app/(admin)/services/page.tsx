/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetAdminServicesQuery, useDeleteServiceMutation, useGetServicesBannerQuery, useUpdateServicesBannerMutation } from '@/store/servicesApi'
import type { ServicesBanner, ServicesBannerFiles } from '@/store/servicesApi'

import ServiceDrawer from './serviceDrawer'
import { canPreview } from './imgPicker'

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
}

// Rich text (HTML) -> plain text. Also decodes entities so "&amp;" shows as "&".
const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim()

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

const MAX_IMAGE_MB = 10

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

/* -------------------------------------------------------------------------- */
/*  Banner image upload                                                       */
/* -------------------------------------------------------------------------- */

type BannerImageUploadProps = {
  label: string
  currentUrl?: string
  file?: File
  disabled?: boolean
  onPick: (file?: File) => void
}

const BannerImageUpload = ({ label, currentUrl, file, disabled, onPick }: BannerImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')

  // Local preview of the file the admin just picked (not uploaded yet)
  useEffect(() => {
    if (!file) {
      setPreview('')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  const shown = preview || (canPreview(currentUrl) ? currentUrl : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]

    if (!picked) {
      onPick(undefined)
      return
    }

    if (!picked.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }

    if (picked.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_MB} MB`)
      e.target.value = ''
      return
    }

    onPick(picked)
  }

  return (
    <div>
      <label className="form-label small fw-semibold">{label}</label>

      <div className="position-relative w-100 rounded border overflow-hidden bg-light" style={{ aspectRatio: '16 / 7', minHeight: 120 }}>
        {shown ? (
          <img src={shown} alt={label} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted text-center p-3">
            <IconifyIcon icon="solar:gallery-add-broken" className="fs-2 mb-1" />
            <span className="small">No image uploaded</span>
          </div>
        )}

        {shown && (
          <span className={`badge position-absolute top-0 start-0 m-2 ${file ? 'bg-warning text-dark' : 'bg-dark bg-opacity-75 text-white'}`}>
            {file ? 'New - not saved yet' : 'Current'}
          </span>
        )}
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
        <input ref={inputRef} type="file" accept="image/*" className="d-none" disabled={disabled} onChange={handleChange} />

        <button
          type="button"
          className="btn btn-soft-primary btn-sm d-inline-flex align-items-center gap-1"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}>
          <IconifyIcon icon="solar:upload-broken" />
          {shown ? 'Replace image' : 'Upload image'}
        </button>

        {file && (
          <button
            type="button"
            className="btn btn-soft-danger btn-sm d-inline-flex align-items-center gap-1"
            disabled={disabled}
            onClick={() => onPick(undefined)}>
            <IconifyIcon icon="solar:close-circle-broken" />
            Undo
          </button>
        )}
      </div>

      <small className="text-muted d-block mt-1 text-break">
        {file ? `${file.name} (${formatSize(file.size)})` : `JPG, PNG, WEBP or AVIF, up to ${MAX_IMAGE_MB} MB. Uploading replaces the current image.`}
      </small>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Banner editor                                                             */
/* -------------------------------------------------------------------------- */

type BannerFormProps = {
  banner: ServicesBanner
}

const BannerForm = ({ banner }: BannerFormProps) => {
  const [title, setTitle] = useState({ ...banner.title })
  const [subtitle, setSubtitle] = useState({ ...banner.subtitle })
  const [files, setFiles] = useState<ServicesBannerFiles>({})

  const [updateBanner, { isLoading }] = useUpdateServicesBannerMutation()

  const reset = () => {
    setTitle({ ...banner.title })
    setSubtitle({ ...banner.subtitle })
    setFiles({})
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()

    for (const { code, name } of LANGS) {
      if (title[code].trim().length < 2) {
        toast.error(`Please fill the banner title (${name})`)
        return
      }

      if (subtitle[code].trim().length < 2) {
        toast.error(`Please fill the banner subtitle (${name})`)
        return
      }
    }

    try {
      await updateBanner({
        data: {
          title: { en: title.en.trim(), ar: title.ar.trim() },
          subtitle: { en: subtitle.en.trim(), ar: subtitle.ar.trim() },
        },
        files,
      }).unwrap()

      toast.success('Services banner updated')
      setFiles({})
    } catch (error: any) {
      toast.error(error?.data?.message || 'Unable to update services banner')
    }
  }

  return (
    <form className="card mb-4" onSubmit={save}>
      <div className="card-header">
        <h5 className="mb-1">Page Banner</h5>

        <small className="text-muted">Title, subtitle and background image shown at the top of the Services page.</small>
      </div>

      <div className="card-body">
        <div className="row g-4">
          {LANGS.map(({ code, name, dir }) => (
            <div className="col-12 col-xl-6" key={code}>
              <div className="border rounded p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="mb-0 fw-bold">{name}</h6>

                  <span className="badge bg-primary-subtle text-primary">{code.toUpperCase()}</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Title</label>

                  <input
                    type="text"
                    className="form-control"
                    value={title[code]}
                    onChange={(e) => setTitle((prev) => ({ ...prev, [code]: e.target.value }))}
                    dir={dir}
                    lang={code}
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Subtitle</label>

                  <textarea
                    className="form-control"
                    rows={4}
                    value={subtitle[code]}
                    onChange={(e) => setSubtitle((prev) => ({ ...prev, [code]: e.target.value }))}
                    dir={dir}
                    lang={code}
                    disabled={isLoading}
                  />
                </div>

                <BannerImageUpload
                  label="Background image"
                  currentUrl={banner.bgImage[code][0]?.url}
                  file={files[code === 'en' ? 'bgImageEn' : 'bgImageAr']}
                  disabled={isLoading}
                  onPick={(file) =>
                    setFiles((prev) => ({
                      ...prev,
                      [code === 'en' ? 'bgImageEn' : 'bgImageAr']: file,
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="d-grid d-sm-flex justify-content-sm-end gap-2">
          <button type="button" className="btn btn-light" onClick={reset} disabled={isLoading}>
            Reset
          </button>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </div>
    </form>
  )
}

const BannerEditor = () => {
  const { data: banner, isLoading, isError, refetch } = useGetServicesBannerQuery()

  if (isLoading) {
    return <div className="card card-body mb-4 text-muted">Loading banner...</div>
  }

  if (isError || !banner) {
    return (
      <div className="card card-body mb-4">
        <p className="text-danger mb-2">Could not load the services banner.</p>

        <div>
          <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </div>
    )
  }

  // key resets the form state to the saved values after every successful save
  return <BannerForm key={banner.updatedAt} banner={banner} />
}

/* -------------------------------------------------------------------------- */
/*  Services table                                                            */
/* -------------------------------------------------------------------------- */

const ServicesTable = () => {
  const { data: services, isLoading, isError, refetch } = useGetAdminServicesQuery()

  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation()

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return

    try {
      await deleteService(id).unwrap()
      toast.success('Service deleted successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Unable to delete service')
    }
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 className="mb-1">Services{services ? ` (${services.length})` : ''}</h5>

          <small className="text-muted">Manage English and Arabic service content.</small>
        </div>

        <ServiceDrawer />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Image</th>
              <th>Title (EN)</th>
              <th>Title (AR)</th>
              <th className="d-none d-xl-table-cell">Description</th>
              <th>Details</th>
              <th className="d-none d-lg-table-cell">Updated</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  Loading services...
                </td>
              </tr>
            )}

            {!isLoading && (isError || !services) && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <p className="text-danger mb-2">Could not load services.</p>

                  <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!isLoading && services && services.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No services available. Start by adding your first service.
                </td>
              </tr>
            )}

            {services?.map((service, index) => {
              const title = stripHtml(service.title.en)

              const icon = service.iconImg.en[0]?.url
              const card = service.cardImg.en[0]?.url

              return (
                <tr key={service._id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {canPreview(card) ? (
                        <img src={card} alt="" width={72} height={48} className="rounded border" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div
                          className="bg-light rounded border d-flex align-items-center justify-content-center text-muted"
                          style={{ width: 72, height: 48 }}>
                          <IconifyIcon icon="solar:gallery-broken" />
                        </div>
                      )}

                      {canPreview(icon) && (
                        <img src={icon} alt="" width={28} height={28} className="d-none d-md-block" style={{ objectFit: 'contain' }} />
                      )}
                    </div>
                  </td>

                  <td className="fw-semibold" style={{ minWidth: 160 }}>
                    {title || '—'}
                  </td>

                  <td dir="rtl" style={{ minWidth: 160 }}>
                    {stripHtml(service.title.ar) || '—'}
                  </td>

                  <td className="d-none d-xl-table-cell text-muted small" style={{ maxWidth: 280 }}>
                    <div className="text-truncate">{stripHtml(service.desc.en) || '—'}</div>
                  </td>

                  <td>
                    <span className="badge bg-primary-subtle text-primary">{service.details.length}</span>
                  </td>

                  <td className="d-none d-lg-table-cell text-muted small">{service.updatedAt?.slice(0, 10) || '—'}</td>

                  <td className="text-end">
                    {/* text-start: the drawer renders inside this cell and would otherwise inherit text-end */}
                    <div className="d-inline-flex gap-2 text-start">
                      <ServiceDrawer service={service} />

                      <button type="button" className="btn btn-soft-danger" disabled={deleting} onClick={() => remove(service._id, title)}>
                        <IconifyIcon icon="solar:trash-bin-trash-broken" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const ServiceAdminPage = () => {
  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Services Management</h4>

        <small className="text-muted">Edit the Services page banner and manage every service in English and Arabic.</small>
      </div>

      <BannerEditor />

      <ServicesTable />
    </div>
  )
}

export default ServiceAdminPage
