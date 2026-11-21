'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Offcanvas, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'
import { useGetEnquiriesQuery, useUpdateEnquiryMutation, useDeleteEnquiryMutation, type Enquiry, type EnquiryStatus } from '@/store/enquiryApi'

const PAGE_SIZE = 20

const statuses: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

const statusBadgeClass: Record<EnquiryStatus, string> = {
  new: 'bg-primary',
  contacted: 'bg-info',
  in_progress: 'bg-warning text-dark',
  closed: 'bg-success',
}

const statusLabel = (value: string) => statuses.find((s) => s.value === value)?.label || value

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB')

const confirmDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You want to delete this enquiry? This cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  })
  return result.isConfirmed
}

export default function EnquiriesAdminPage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<EnquiryStatus | ''>('')
  const { data, isLoading, isFetching, isError, refetch } = useGetEnquiriesQuery({
    page,
    limit: PAGE_SIZE,
    status: filter,
  })
  const [updateEnquiry, { isLoading: saving }] = useUpdateEnquiryMutation()
  const [deleteEnquiry, { isLoading: deleting }] = useDeleteEnquiryMutation()
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [status, setStatus] = useState<EnquiryStatus>('new')
  const [notes, setNotes] = useState('')

  const busy = saving || deleting
  const items = data?.data ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = Math.max(1, data?.pagination.pages || 1)

  // If the last item on the last page was deleted, step back to the new last page.
  useEffect(() => {
    if (data && page > data.pagination.pages && page > 1) {
      setPage(Math.max(1, data.pagination.pages))
    }
  }, [data, page])

  const openDetails = (item: Enquiry) => {
    setSelected(item)
    setStatus(item.status)
    setNotes(item.adminNotes || '')
  }

  const closeDetails = () => {
    if (!busy) setSelected(null)
  }

  const save = async () => {
    if (!selected) return
    try {
      await updateEnquiry({ id: selected._id, status, adminNotes: notes }).unwrap()
      toast.success('Enquiry updated')
      setSelected(null)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Unable to update enquiry')
    }
  }

  const remove = async (item: Enquiry) => {
    if (busy) return
    if (!(await confirmDelete())) return
    try {
      await deleteEnquiry(item._id).unwrap()
      toast.success('Enquiry deleted')
      if (selected?._id === item._id) setSelected(null)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Unable to delete enquiry')
    }
  }

  const onFilterChange = (value: EnquiryStatus | '') => {
    setFilter(value)
    setPage(1)
  }

  return (
    <>
      <PageTItle title="Contact Enquiries" />

      <Row>
        <Col xs={12}>
          <Card>
            {/* Header: title + filters (stacks on small screens) */}
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <CardTitle as="h4" className="mb-0">
                Contact Enquiries
              </CardTitle>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <select
                  className="form-select w-auto"
                  aria-label="Filter by status"
                  value={filter}
                  onChange={(e) => onFilterChange(e.target.value as EnquiryStatus | '')}>
                  <option value="">All statuses</option>
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn btn-outline-primary" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <CardBody>
              {isLoading && <div className="text-center py-4">Loading enquiries...</div>}

              {isError && <div className="text-center text-danger py-4">Unable to load enquiries. Check API and authentication.</div>}

              {!isLoading && !isError && items.length === 0 && <div className="text-center py-4">No enquiries found.</div>}

              {/* Desktop / tablet: table */}
              {!isLoading && !isError && items.length > 0 && (
                <div className="table-responsive d-none d-md-block">
                  <table className="table table-hover table-bordered align-middle mb-0">
                    <thead className="bg-light-subtle">
                      <tr>
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item._id}>
                          <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.companyName || '—'}</td>
                          <td className="text-break">{item.email}</td>
                          <td className="text-nowrap">
                            {item.countryCode} {item.mobile}
                          </td>
                          <td>{item.service}</td>
                          <td className="text-nowrap">{formatDate(item.createdAt)}</td>
                          <td>
                            <span className={`badge ${statusBadgeClass[item.status] || 'bg-secondary'}`}>{statusLabel(item.status)}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button type="button" className="btn btn-sm btn-soft-primary" onClick={() => openDetails(item)} disabled={busy}>
                                View / Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-soft-danger"
                                aria-label={`Delete enquiry from ${item.name}`}
                                title="Delete enquiry"
                                onClick={() => remove(item)}
                                disabled={busy}>
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile: stacked cards */}
              {!isLoading && !isError && items.length > 0 && (
                <div className="d-md-none d-flex flex-column gap-3">
                  {items.map((item) => (
                    <div key={item._id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-0 text-break">{item.name}</h6>
                          <small className="text-muted">{formatDate(item.createdAt)}</small>
                        </div>
                        <span className={`badge flex-shrink-0 ${statusBadgeClass[item.status] || 'bg-secondary'}`}>{statusLabel(item.status)}</span>
                      </div>

                      <div className="small d-grid gap-1 mb-3">
                        <div>
                          <span className="text-muted">Company: </span>
                          {item.companyName || '—'}
                        </div>
                        <div className="text-break">
                          <span className="text-muted">Email: </span>
                          {item.email}
                        </div>
                        <div>
                          <span className="text-muted">Phone: </span>
                          {item.countryCode} {item.mobile}
                        </div>
                        <div>
                          <span className="text-muted">Service: </span>
                          {item.service}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-soft-primary flex-grow-1" onClick={() => openDetails(item)} disabled={busy}>
                          View / Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-soft-danger"
                          aria-label={`Delete enquiry from ${item.name}`}
                          onClick={() => remove(item)}
                          disabled={busy}>
                          <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>

            {/* Footer: count + pagination (wraps on small screens) */}
            <CardFooter className="border-top d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center">
              <small className="text-muted">{total} enquiries</small>
              <div className="d-flex gap-2 align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <span className="small text-nowrap">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* Details drawer */}
      <Offcanvas show={!!selected} onHide={closeDetails} placement="end" style={{ width: 'min(560px, 100vw)' }}>
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title as="h5">Enquiry Details</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {selected && (
            <>
              <dl className="row mb-4 gy-2">
                <dt className="col-4 text-muted fw-normal">Name</dt>
                <dd className="col-8 mb-0">{selected.name}</dd>

                <dt className="col-4 text-muted fw-normal">Company</dt>
                <dd className="col-8 mb-0">{selected.companyName || '—'}</dd>

                <dt className="col-4 text-muted fw-normal">Email</dt>
                <dd className="col-8 mb-0 text-break">
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </dd>

                <dt className="col-4 text-muted fw-normal">Phone</dt>
                <dd className="col-8 mb-0">
                  <a href={`tel:${selected.countryCode}${selected.mobile}`}>
                    {selected.countryCode} {selected.mobile}
                  </a>
                </dd>

                <dt className="col-4 text-muted fw-normal">Service</dt>
                <dd className="col-8 mb-0">{selected.service}</dd>

                <dt className="col-4 text-muted fw-normal">Language</dt>
                <dd className="col-8 mb-0">{selected.language === 'ar' ? 'Arabic' : 'English'}</dd>

                <dt className="col-4 text-muted fw-normal">Submitted</dt>
                <dd className="col-8 mb-0">{new Date(selected.createdAt).toLocaleString()}</dd>
              </dl>

              <label className="form-label fw-semibold">Requirements</label>
              <div className="border rounded p-3 mb-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selected.requirements}
              </div>

              <label htmlFor="enquiry-status" className="form-label fw-semibold">
                Status
              </label>
              <select
                id="enquiry-status"
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
                disabled={busy}>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label htmlFor="enquiry-notes" className="form-label fw-semibold">
                Internal notes
              </label>
              <textarea
                id="enquiry-notes"
                className="form-control mb-4"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={busy}
              />

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button type="button" className="btn btn-primary flex-grow-1" disabled={busy} onClick={save}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline-danger" disabled={busy} onClick={() => remove(selected)}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
