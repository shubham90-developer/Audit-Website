/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { useGetBannersQuery } from '@/store/bannerApi'
import EditBannerDrawer from './components/EditHomeBannerDrawer'
import type { Localized, LocalizedMedia } from '@/store/bannerApi'
const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

// Shows the English and Arabic value of one field, one under the other
const Pair = ({ value, className = '', labelClass = '' }: { value: Localized; className?: string; labelClass?: string }) => (
  <>
    <div className={className} dir="ltr" lang="en">
      {value.en}
    </div>
    <div className={className} dir="rtl" lang="ar">
      {value.ar}
    </div>
  </>
)

const Label = ({ children }: { children: React.ReactNode }) => <div className="small text-uppercase text-muted fw-semibold mt-3 mb-2">{children}</div>

// Every uploaded file for one media group, English and Arabic lists separately
const MediaGroup = ({ title, kind, media }: { title: string; kind: 'image' | 'video'; media: LocalizedMedia }) => (
  <div className="mb-4">
    <div className="fw-semibold small mb-2">{title}</div>

    {LANGS.map(({ code, name, dir }) => (
      <div key={code} className="mb-3" dir={dir} lang={code}>
        <div className="small text-muted mb-1">
          {name} ({media[code].length} file{media[code].length === 1 ? '' : 's'})
        </div>

        {media[code].length === 0 && <div className="small text-muted">No files uploaded</div>}

        <div className="d-flex flex-wrap gap-2">
          {media[code].map((m) =>
            kind === 'image' ? (
              <img key={m.publicId} src={m.url} alt="" style={{ width: 180, height: 110, objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <video
                key={m.publicId}
                src={m.url}
                controls
                muted
                playsInline
                style={{ width: 260, height: 150, objectFit: 'cover', borderRadius: 8 }}
              />
            ),
          )}
        </div>
      </div>
    ))}
  </div>
)

const HomeBannerPage = () => {
  const { data: banners, isLoading, isError, refetch } = useGetBannersQuery()

  if (isLoading) return <div className="p-3 text-muted">Loading banner...</div>

  if (isError) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the banner.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const banner = banners?.[0]
  if (!banner) return <div className="p-3 text-muted">No banner found.</div>

  return (
    <div className="p-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Home Banner</h5>
        <EditBannerDrawer item={banner} />
      </div>

      <div className="row g-4">
        {/* TEXT: every field in both languages */}
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <Label>Heading</Label>
              <div className="fw-bold fs-4" dir="ltr">
                <span className="text-success">{banner.titleHighlight.en}</span> {banner.titleRest.en}
              </div>
              <div className="fw-bold fs-4 mb-2" dir="rtl" lang="ar">
                <span className="text-success">{banner.titleHighlight.ar}</span> {banner.titleRest.ar}
              </div>

              <Label>Established year</Label>
              <Pair value={banner.establishmentYear} className="small" />

              <Label>Intro</Label>
              <Pair value={banner.intro} className="mb-2" />

              <Label>Speak label</Label>
              <Pair value={banner.speakLabel} className="small" />

              <Label>Buttons</Label>
              <div className="row g-2">
                {[
                  { title: 'Primary button', cta: banner.primaryCta },
                  { title: 'Secondary button', cta: banner.secondaryCta },
                ].map(({ title, cta }) => (
                  <div className="col-md-6" key={title}>
                    <div className="border rounded p-2 h-100 small">
                      <div className="fw-semibold mb-1">
                        {title} <span className="text-muted">({cta.variant})</span>
                      </div>
                      <Pair value={cta.label} />
                      <div className="text-muted mt-1">
                        EN link: {cta.href.en} · AR link: {cta.href.ar}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Label>Tax agency card</Label>
              <div className="border rounded p-2 small">
                <div className="fw-semibold">{banner.ftaCard.line1.en}</div>
                <div className="text-muted">{banner.ftaCard.line2.en}</div>
                <div className="text-muted">{banner.ftaCard.licenseNumber.en}</div>
                <hr />
                <div className="fw-semibold" dir="rtl" lang="ar">
                  {banner.ftaCard.line1.ar}
                </div>
                <div className="text-muted" dir="rtl" lang="ar">
                  {banner.ftaCard.line2.ar}
                </div>
                <div className="text-muted" dir="rtl" lang="ar">
                  {banner.ftaCard.licenseNumber.ar}
                </div>
              </div>

              <Label>Partner card</Label>
              <div className="border rounded p-2 small">
                <Pair value={banner.partnerCard.title} className="fw-semibold" />
                <Pair value={banner.partnerCard.subtitle} className="text-muted" />
              </div>

              <Label>Experience card</Label>
              <div className="border rounded p-2 small">
                <Pair value={banner.experienceCard.value} className="fw-semibold" />
                <Pair value={banner.experienceCard.label} className="text-muted" />
                <Pair value={banner.experienceCard.tagline} className="text-muted" />
              </div>

              <Label>Reviews</Label>
              {banner.reviewRatings.map((r, i) => (
                <div className="border rounded p-2 small mb-2" key={`${r.platform}-${i}`}>
                  <div className="fw-semibold mb-1">
                    {r.platform} · {r.score} <span className="text-warning">★★★★★</span>
                  </div>
                  <Pair value={r.label} className="text-muted" />
                </div>
              ))}

              <Label>Trust note</Label>
              <Pair value={banner.trustedNote} className="small" />
            </div>
          </div>
        </div>

        {/* MEDIA: all files, both languages */}
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <Label>Media</Label>
              <MediaGroup title="Background image" kind="image" media={banner.bgImages} />
              <MediaGroup title="Video poster" kind="image" media={banner.posterImage} />
              <MediaGroup title="Background video" kind="video" media={banner.bgVideos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBannerPage
