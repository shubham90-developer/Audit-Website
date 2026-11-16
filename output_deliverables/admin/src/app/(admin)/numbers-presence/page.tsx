/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SectionEditor from '@/components/sectionEditor'
import { useGetNumbersPresenceQuery, useDeleteStatMutation, useDeleteOfficeMutation } from '@/store/numbersPresenceApi'
import StatDrawer from './statDrawer'
import OfficeDrawer from './officeDrawer'

const NumbersPresenceAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetNumbersPresenceQuery()
  const [deleteStat] = useDeleteStatMutation()
  const [deleteOffice] = useDeleteOfficeMutation()

  if (isLoading) return <div className="p-3 text-muted">Loading...</div>

  if (isError || !data) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the content.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const { section, stats, offices } = data
  const nextStatOrder = stats.length === 0 ? 0 : Math.max(...stats.map((s) => s.order)) + 1
  const nextOfficeOrder = offices.length === 0 ? 0 : Math.max(...offices.map((o) => o.order)) + 1

  const removeStat = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteStat(id).unwrap()
      toast.success('Stat deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const removeOffice = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteOffice(id).unwrap()
      toast.success('Office deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Numbers &amp; Global Presence</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      {/* ---------- Stats ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Stats ({stats.length})</h6>
        <StatDrawer nextOrder={nextStatOrder} />
      </div>

      <div className="list-group mb-4">
        {stats.map((s) => (
          <div key={s._id} className="list-group-item d-flex align-items-center gap-3">
            <div className="fw-bold fs-5" style={{ minWidth: 72 }}>
              {s.value}
              {s.suffix}
            </div>

            <div className="flex-grow-1">
              <div className="fw-semibold">{s.label.en}</div>
              <div className="small text-muted" dir="rtl" lang="ar">
                {s.label.ar}
              </div>
              <div className="small text-muted">
                Order {s.order} · icon: {s.icon} · color: {s.color}
              </div>
            </div>

            <StatDrawer stat={s} nextOrder={nextStatOrder} />

            <button type="button" className="btn btn-soft-danger" onClick={() => removeStat(s._id, s.label.en)} aria-label="Delete stat">
              <IconifyIcon icon="solar:trash-bin-trash-broken" />
            </button>
          </div>
        ))}
      </div>

      {/* ---------- Offices ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Offices ({offices.length})</h6>
        <OfficeDrawer nextOrder={nextOfficeOrder} />
      </div>

      <div className="list-group">
        {offices.map((o) => {
          const thumb = o.image.en[0]?.url ?? o.image.ar[0]?.url

          return (
            <div key={o._id} className="list-group-item d-flex align-items-center gap-3">
              {thumb ? (
                <img src={thumb} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div className="bg-light rounded" style={{ width: 48, height: 48 }} />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">
                  {o.city.en}, {o.country.en}
                </div>
                <div className="small text-muted" dir="rtl" lang="ar">
                  {o.city.ar}، {o.country.ar}
                </div>
                <div className="small text-muted">
                  Order {o.order} · flag: {o.flagCode}
                </div>
              </div>

              <OfficeDrawer office={o} nextOrder={nextOfficeOrder} />

              <button type="button" className="btn btn-soft-danger" onClick={() => removeOffice(o._id, o.city.en)} aria-label="Delete office">
                <IconifyIcon icon="solar:trash-bin-trash-broken" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NumbersPresenceAdminPage
