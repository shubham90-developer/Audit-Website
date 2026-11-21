'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

/**
 * Client-side second line of defence behind src/middleware.ts: if the token disappears while the
 * app is open (logout in another tab, 401 handler, expiry) the user is sent back to sign-in.
 * Renders nothing until we know there is a session, so protected pages never mount (or fire
 * API calls) without a token.
 */
const AuthProtectionWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (mounted && !token) router.replace('/auth/sign-in')
  }, [mounted, token, router])

  // keep tabs in sync: token removed/changed in another tab -> reload so Redux re-reads storage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') window.location.reload()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // wait for mount so server HTML and first client render match (token lives in localStorage)
  return mounted && token ? <>{children}</> : null
}

export default AuthProtectionWrapper
