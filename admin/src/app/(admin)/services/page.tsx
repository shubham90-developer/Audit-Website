'use client'

import React from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetAdminServicesQuery, useDeleteServiceMutation } from '@/store/servicesApi'

import ServiceDrawer from './serviceDrawer'
import { canPreview } from './imgPicker'

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const ServiceAdminPage = () => {
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

  if (isLoading) {
    return <div className="p-3 text-muted">Loading services...</div>
  }

  if (isError || !services) {
    return (
      <div className="p-3">
        <p className="text-danger">Could not load services.</p>

        <button className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-1">Services Management</h5>

          <small className="text-muted">Manage English and Arabic service content.</small>
        </div>

        <ServiceDrawer />
      </div>

      <div className="row g-3">
        {services.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <h6>No services available</h6>
                <p className="text-muted mb-0">Start by adding your first service.</p>
              </div>
            </div>
          </div>
        ) : (
          services.map((service) => {
            const title = stripHtml(service.title.en)

            const icon = service.iconImg.en[0]?.url
            const card = service.cardImg.en[0]?.url
            const background = service.bgImage.en[0]?.url
            const video = service.bgVideo.en[0]?.url

            return (
              <div className="col-12 col-md-6 col-xl-4" key={service._id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        {canPreview(icon) ? (
                          <img
                            src={icon}
                            alt=""
                            width={45}
                            height={45}
                            style={{
                              objectFit: 'contain',
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded"
                            style={{
                              width: 45,
                              height: 45,
                            }}
                          />
                        )}

                        <div>
                          <h6 className="fw-bold mb-0">{title}</h6>

                          <small className="text-muted">{service.details.length} details</small>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <ServiceDrawer service={service} />

                        <button type="button" className="btn btn-soft-danger" disabled={deleting} onClick={() => remove(service._id, title)}>
                          <IconifyIcon icon="solar:trash-bin-trash-broken" />
                        </button>
                      </div>
                    </div>

                    <p className="small text-muted">{stripHtml(service.desc.en)}</p>

                    {canPreview(card) && (
                      <div className="mb-3">
                        <small className="text-muted">Card image</small>

                        <img
                          src={card}
                          alt=""
                          className="w-100 rounded mt-1"
                          style={{
                            height: 140,
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}

                    {canPreview(background) && (
                      <div className="mb-3">
                        <small className="text-muted">Background image</small>

                        <img
                          src={background}
                          alt=""
                          className="w-100 rounded mt-1"
                          style={{
                            height: 110,
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}

                    {canPreview(video) && (
                      <div className="mb-3">
                        <small className="text-muted">Background video</small>

                        <video src={video} controls className="w-100 rounded mt-1" style={{ maxHeight: 150 }} />
                      </div>
                    )}

                    <div className="border-top pt-3">
                      <div className="small fw-semibold mb-2">Arabic title</div>

                      <div dir="rtl" lang="ar">
                        {stripHtml(service.title.ar)}
                      </div>

                      <div className="small text-muted mt-2">{stripHtml(service.desc.ar)}</div>
                    </div>

                    <div className="border-top mt-3 pt-3">
                      <small className="fw-semibold">Detail items</small>

                      {service.details.map((detail, index) => (
                        <div key={detail._id || index} className="small mt-2">
                          <span className="text-success fw-semibold">{index + 1}. </span>

                          {stripHtml(detail.title.en)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ServiceAdminPage
