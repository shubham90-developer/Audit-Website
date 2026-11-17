/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetGlobalMarketsQuery, useDeleteMarketMutation } from '@/store/globalMarketsApi'

import SectionEditor from './sectionEditor'
import MarketDrawer from './marketDrawer'
import { canPreview } from './imagePicker'

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const GlobalMarketsAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetGlobalMarketsQuery()

  const [deleteMarket, { isLoading: deleting }] = useDeleteMarketMutation()

  if (isLoading) {
    return <div className="p-3 text-muted">Loading global markets...</div>
  }

  if (isError || !data) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load global markets content.</p>

        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const { section, markets } = data

  const nextOrder = markets.length === 0 ? 0 : Math.max(...markets.map((m) => m.order)) + 1

  const sortedMarkets = [...markets].sort((a, b) => a.order - b.order)

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return

    try {
      await deleteMarket(id).unwrap()
      toast.success('Country deleted successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      {/* PAGE HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-1">Global Markets</h5>

          <p className="text-muted small mb-0">Manage your global presence section and country cards.</p>
        </div>
      </div>

      {/* MAIN SECTION EDITOR */}

      <SectionEditor key={section.updatedAt} section={section} />

      {/* COUNTRY CARDS HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h6 className="fw-bold mb-1">Country Cards ({markets.length})</h6>

          <small className="text-muted">Manage countries displayed in the global markets section.</small>
        </div>

        <MarketDrawer nextOrder={nextOrder} />
      </div>

      {/* COUNTRY LIST */}

      {sortedMarkets.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <IconifyIcon icon="solar:global-broken" className="fs-1 text-muted mb-2" />

            <h6 className="fw-semibold">No countries added yet</h6>

            <p className="text-muted small mb-0">Add your first country to get started.</p>
          </div>
        </div>
      ) : (
        <div className="list-group">
          {sortedMarkets.map((market, index) => {
            const englishImage = market.image.en[0]?.url

            const arabicImage = market.image.ar[0]?.url

            const thumb = englishImage || arabicImage

            return (
              <div key={market._id} className="list-group-item d-flex align-items-center gap-3 flex-wrap">
                {/* ORDER */}

                <div className="fw-bold text-success" style={{ minWidth: 32 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* IMAGE */}

                {canPreview(thumb) ? (
                  <img
                    src={thumb}
                    alt=""
                    width={75}
                    height={65}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: 75,
                      height: 65,
                    }}>
                    <IconifyIcon icon="solar:global-broken" className="fs-3 text-muted" />
                  </div>
                )}

                {/* COUNTRY DETAILS */}

                <div className="flex-grow-1">
                  <div className="fw-semibold">{market.title.en}</div>

                  <div className="small text-muted" dir="rtl" lang="ar">
                    {market.title.ar}
                  </div>

                  <div className="small text-muted">Display order: {market.order}</div>

                  <div className="d-flex gap-2 mt-1 flex-wrap">
                    <span className={`badge ${market.isActive ? 'bg-success' : 'bg-secondary'}`}>{market.isActive ? 'Active' : 'Inactive'}</span>

                    {englishImage && <span className="badge bg-light text-dark">EN Image</span>}

                    {arabicImage && <span className="badge bg-light text-dark">AR Image</span>}
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="d-flex gap-2 align-items-center">
                  <MarketDrawer market={market} nextOrder={nextOrder} />

                  <button
                    type="button"
                    className="btn btn-soft-danger"
                    disabled={deleting}
                    onClick={() => remove(market._id, stripHtml(market.title.en))}
                    aria-label="Delete country">
                    <IconifyIcon icon="solar:trash-bin-trash-broken" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GlobalMarketsAdminPage
