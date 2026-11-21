'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  _id?: string
  id?: string
  name?: string
  email?: string
  role?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

// read the `exp` claim (seconds) from a JWT without verifying it - verification is the API's job
const getExp = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax'
}

// drop an expired/garbage token on page load instead of starting "logged in"
const initialToken = (() => {
  const token = getToken()
  if (!token || typeof window === 'undefined') return token
  const exp = getExp(token)
  if (!exp || exp * 1000 <= Date.now()) {
    clearSession()
    return null
  }
  return token
})()

const initialState: AuthState = {
  token: initialToken,
  user: initialToken ? getUser() : null,
  isAuthenticated: Boolean(initialToken),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      const { token, user } = action.payload

      state.token = token
      state.user = user
      state.isAuthenticated = true

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        // Cookie for Next.js middleware. Secure on HTTPS deployments.
        const secure = window.location.protocol === 'https:' ? '; Secure' : ''
        const exp = getExp(token)
        const maxAge = exp ? Math.max(exp - Math.floor(Date.now() / 1000), 0) : 86400
        document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
      }
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false

      if (typeof window !== 'undefined') clearSession()
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions

export default authSlice.reducer
