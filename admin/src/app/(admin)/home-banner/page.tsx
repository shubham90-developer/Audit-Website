'use client'

import React from 'react'
import { useGetBannersQuery } from '@/store/homeBanner'
import EditBannerDrawer from './components/EditHomeBannerDrawer'

const HomeBannerPage = () => {
  const { data: banners, isLoading, isError } = useGetBannersQuery()

  if (isLoading) return null
  if (isError) return <p className="text-danger p-3">Could not load the banner.</p>

  const banner = banners?.[0]
  if (!banner) return null

  return <EditBannerDrawer item={banner} />
}

export default HomeBannerPage
