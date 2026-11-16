'use client'

import React from 'react'
import { useGetPartnersQuery } from '@/store/partnerApi'
import EditPartnerDrawer from './editPartner'
import AddPartnerDrawer from './add-partner'

const PartnersPage = () => {
  const { data: partners = [], isLoading, isError, refetch } = useGetPartnersQuery()

  if (isLoading) return <div className="p-3 text-muted">Loading partners...</div>

  if (isError) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load partners.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  // New partners go after the highest existing order
  const nextOrder = partners.length === 0 ? 0 : Math.max(...partners.map((p) => p.order)) + 1

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Partnership ({partners.length})</h5>
        <AddPartnerDrawer nextOrder={nextOrder} />
      </div>

      <div className="list-group">
        {partners.map((p) => {
          const thumb = p.logo.en[0]?.url ?? p.logo.ar[0]?.url

          return (
            <div key={p._id} className="list-group-item d-flex align-items-center gap-3">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" width={48} height={48} style={{ objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 48, height: 48 }} className="bg-light rounded" />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">{p.title.en}</div>
                <div className="fw-semibold text-muted small" dir="rtl" lang="ar">
                  {p.title.ar}
                </div>
                <div className="small text-muted">Order: {p.order}</div>
              </div>

              <EditPartnerDrawer item={p} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PartnersPage
