/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetLeadershipAdminQuery, useDeleteLeadershipMemberMutation } from '@/store/leadershipApi'

import SectionEditor from './sectionEditor'
import MemberDrawer from './memberDrawer'
import { canPreview } from './imagePicker'

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const LeadershipAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetLeadershipAdminQuery()

  const [deleteMember, { isLoading: deleting }] = useDeleteLeadershipMemberMutation()

  if (isLoading) {
    return <div className="p-3 text-muted">Loading leadership content...</div>
  }

  if (isError || !data) {
    return (
      <div className="p-3">
        <p className="text-danger">Could not load leadership content.</p>

        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const { section, members } = data

  const sortedMembers = [...members].sort((a, b) => a.order - b.order)

  const featuredLeader = members.find((member) => member.isFeatured)

  const teamMembers = sortedMembers.filter((member) => !member.isFeatured)

  const nextOrder = members.length === 0 ? 0 : Math.max(...members.map((m) => m.order)) + 1

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete "${label}"?`)) return

    try {
      await deleteMember(id).unwrap()
      toast.success('Team member deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const renderMember = (member: (typeof members)[number]) => {
    const thumb = member.image.en[0]?.url || member.image.ar[0]?.url

    return (
      <div key={member._id} className="list-group-item d-flex align-items-center gap-3 flex-wrap">
        <div className="fw-bold text-success" style={{ minWidth: 32 }}>
          {String(member.order + 1).padStart(2, '0')}
        </div>

        {canPreview(thumb) ? (
          <img
            src={thumb}
            alt=""
            width={65}
            height={70}
            style={{
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        ) : (
          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 65, height: 70 }}>
            <IconifyIcon icon="solar:user-broken" className="fs-3 text-muted" />
          </div>
        )}

        <div className="flex-grow-1">
          <div className="fw-semibold">{member.name.en}</div>

          <div className="small text-muted" dir="rtl" lang="ar">
            {member.name.ar}
          </div>

          <div className="small text-success">{member.role.en}</div>

          <div className="small text-muted">{member.department.en}</div>

          <div className="small text-muted">Order: {member.order}</div>

          <div className="d-flex gap-2 mt-2 flex-wrap">
            <span className={`badge ${member.isActive ? 'bg-success' : 'bg-secondary'}`}>{member.isActive ? 'Active' : 'Inactive'}</span>

            {member.isFeatured && <span className="badge bg-warning text-dark">Featured Leader</span>}
          </div>
        </div>

        <div className="d-flex gap-2">
          <MemberDrawer member={member} nextOrder={nextOrder} />

          <button
            type="button"
            className="btn btn-soft-danger"
            disabled={deleting}
            onClick={() => remove(member._id, stripHtml(member.name.en))}
            aria-label="Delete member">
            <IconifyIcon icon="solar:trash-bin-trash-broken" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      {/* HEADER */}

      <div className="mb-4">
        <h5 className="fw-bold mb-1">Leadership & Team</h5>

        <p className="text-muted small mb-0">Manage leadership profiles and your company team members.</p>
      </div>

      {/* SECTION CONTENT */}

      <SectionEditor key={section.updatedAt} section={section} />

      {/* FEATURED LEADER */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold mb-1">Leadership Profile</h6>

          <small className="text-muted">Manage the featured leader shown above the team cards.</small>
        </div>

        {!featuredLeader && <MemberDrawer nextOrder={nextOrder} />}
      </div>

      {featuredLeader ? (
        <div className="list-group mb-4">{renderMember(featuredLeader)}</div>
      ) : (
        <div className="card mb-4">
          <div className="card-body text-center py-4">
            <IconifyIcon icon="solar:user-broken" className="fs-1 text-muted" />

            <p className="text-muted small mt-2 mb-0">No featured leader selected. Add a member and enable Featured leadership member.</p>
          </div>
        </div>
      )}

      {/* TEAM MEMBERS */}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h6 className="fw-bold mb-1">Team Members ({teamMembers.length})</h6>

          <small className="text-muted">Manage the people displayed in the team carousel.</small>
        </div>

        <MemberDrawer nextOrder={nextOrder} />
      </div>

      {teamMembers.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <IconifyIcon icon="solar:users-group-rounded-broken" className="fs-1 text-muted" />

            <h6 className="fw-semibold mt-2">No team members yet</h6>

            <p className="text-muted small mb-0">Add your first team member.</p>
          </div>
        </div>
      ) : (
        <div className="list-group">{teamMembers.map(renderMember)}</div>
      )}
    </div>
  )
}

export default LeadershipAdminPage
