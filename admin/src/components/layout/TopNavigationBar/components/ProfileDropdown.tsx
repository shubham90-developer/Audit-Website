'use client'

import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/store/authSlice'
import { useGetSiteSettingsQuery } from '@/store/siteSettingsApi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const ProfileDropdown = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { data: settings } = useGetSiteSettingsQuery()

  // API returns favicon as { url, publicId }; fall back to the default avatar while loading / if unset
  const profileImage = settings?.favicon?.url || avatar1

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logout()) // clears token from state, localStorage and cookie
    router.replace('/auth/sign-in')
  }

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as="a"
        href="#"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image
            className="rounded-circle"
            width={32}
            height={32}
            src={profileImage}
            alt="Profile"
            unoptimized
            style={{
              objectFit: 'cover',
            }}
          />
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as="h6" className="dropdown-header">
          Welcome To Audit!
        </DropdownHeader>

        <div className="dropdown-divider my-1" />

        <DropdownItem as="a" href="#" className="text-danger" onClick={handleLogout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
