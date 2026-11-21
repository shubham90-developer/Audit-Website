'use client'

import { useGetSiteSettingsQuery } from '@/store/siteSettingsApi'
import Image from 'next/image'
import Link from 'next/link'

const LogoBox = () => {
  const { data: settings, isLoading } = useGetSiteSettingsQuery()

  // API returns logos as { url, publicId }. The sidebar is dark, so use the footer (light) logo,
  // and fall back to the main logo if no footer logo is uploaded.
  const logoUrl = settings?.footerLogo?.url || settings?.logo?.url || ''

  const renderLogo = () =>
    !isLoading &&
    logoUrl && (
      <>
        <Image src={logoUrl} width={32} height={32} className="logo-sm" alt="Logo" unoptimized style={{ objectFit: 'contain' }} />
        <Image src={logoUrl} width={150} height={50} className="logo-lg" alt="Logo" unoptimized style={{ objectFit: 'contain' }} />
      </>
    )

  return (
    <div className="logo-box">
      {/* DARK LOGO */}
      <Link href="/dashboard" className="logo-dark">
        {renderLogo()}
      </Link>

      {/* LIGHT LOGO */}
      <Link href="/dashboard" className="logo-light">
        {renderLogo()}
      </Link>
    </div>
  )
}

export default LogoBox
