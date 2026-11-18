'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  useGetEnquiriesQuery,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
  type Enquiry,
  type EnquiryStatus,
} from '@/store/enquiryApi'

const statuses: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export default function EnquiriesAdminPage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<EnquiryStatus | ''>('')
  const { data, isLoading, isError, refetch } = useGetEnquiriesQuery({ page, limit: 20, status: filter })
  const [updateEnquiry, { isLoading: saving }] = useUpdateEnquiryMutation()
  const [deleteEnquiry, { isLoading: deleting }] = useDeleteEnquiryMutation()
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [status, setStatus] = useState<EnquiryStatus>('new')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (selected) {
      setStatus(selected.status)
      setNotes(selected.adminNotes || '')
    }
  }, [selected])

  const save = async () => {
    if (!selected) return
    try {
      await updateEnquiry({ id: selected._id, status, adminNotes: notes }).unwrap()
      toast.success('Enquiry updated')
      setSelected(null)
    } catch (err: any) { toast.error(err?.data?.message || 'Unable to update enquiry') }
  }

  const remove = async () => {
    if (!selected || !window.confirm('Permanently delete this enquiry?')) return
    try {
      await deleteEnquiry(selected._id).unwrap()
      toast.success('Enquiry deleted')
      setSelected(null)
    } catch (err: any) { toast.error(err?.data?.message || 'Unable to delete enquiry') }
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h4 className="mb-0">Contact Enquiries</h4>
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select" aria-label="Filter by status" value={filter} onChange={(e) => { setFilter(e.target.value as EnquiryStatus | ''); setPage(1) }}>
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button type="button" className="btn btn-outline-primary" onClick={() => refetch()}>Refresh</button>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light"><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Service</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {isLoading && <tr><td colSpan={8} className="text-center py-4">Loading enquiries...</td></tr>}
              {isError && <tr><td colSpan={8} className="text-center text-danger py-4">Unable to load enquiries. Check API and authentication.</td></tr>}
              {!isLoading && !isError && data?.data.length === 0 && <tr><td colSpan={8} className="text-center py-4">No enquiries found.</td></tr>}
              {!isLoading && !isError && data?.data.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td><td>{item.companyName || '—'}</td><td>{item.email}</td>
                  <td>{item.countryCode} {item.mobile}</td><td>{item.service}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                  <td><span className="badge bg-secondary">{statuses.find((s) => s.value === item.status)?.label || item.status}</span></td>
                  <td><button type="button" className="btn btn-sm btn-soft-primary" onClick={() => setSelected(item)}>View / Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>{data?.pagination.total || 0} enquiries</small>
          <div className="d-flex gap-2 align-items-center">
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page} of {Math.max(1, data?.pagination.pages || 1)}</span>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled={page >= (data?.pagination.pages || 1)} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {selected && <>
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,.5)', zIndex: 1040 }} onClick={() => !saving && !deleting && setSelected(null)} />
        <div className="position-fixed top-0 end-0 bg-white shadow-lg h-100 overflow-auto" style={{ width: 560, maxWidth: '100%', zIndex: 1050 }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center"><h5 className="mb-0">Enquiry Details</h5><button type="button" className="btn btn-sm btn-light" onClick={() => setSelected(null)}>✕</button></div>
          <div className="p-3">
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Company:</strong> {selected.companyName || '—'}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
            <p><strong>Phone:</strong> {selected.countryCode} {selected.mobile}</p>
            <p><strong>Service:</strong> {selected.service}</p>
            <p><strong>Language:</strong> {selected.language === 'ar' ? 'Arabic' : 'English'}</p>
            <p><strong>Submitted:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            <label className="form-label fw-semibold">Requirements</label>
            <div className="border rounded p-3 mb-3" style={{ whiteSpace: 'pre-wrap' }}>{selected.requirements}</div>
            <label className="form-label fw-semibold">Status</label>
            <select className="form-select mb-3" value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus)} disabled={saving}>
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <label className="form-label fw-semibold">Internal notes</label>
            <textarea className="form-control mb-3" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={saving} />
            <div className="d-flex gap-2"><button type="button" className="btn btn-primary flex-grow-1" disabled={saving || deleting} onClick={save}>{saving ? 'Saving...' : 'Save Changes'}</button><button type="button" className="btn btn-outline-danger" disabled={saving || deleting} onClick={remove}>{deleting ? 'Deleting...' : 'Delete'}</button></div>
          </div>
        </div>
      </>}
    </div>
  )
}
