import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store'
import { logout } from './authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    // Content-Type is intentionally NOT set: JSON bodies get it from fetchBaseQuery,
    // FormData bodies need the browser's multipart boundary.
    return headers
  },
})

/**
 * Shared base query for every admin API slice.
 * Adds the Bearer token, and if the API answers 401 while we hold a token
 * (expired / revoked / invalid) it clears the session and sends the user to sign-in.
 */
export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && (api.getState() as RootState).auth?.token) {
    api.dispatch(logout())
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
      window.location.replace('/auth/sign-in')
    }
  }
  return result
}
