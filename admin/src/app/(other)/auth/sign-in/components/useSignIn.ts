'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useNotificationContext } from '@/context/useNotificationContext'
import { useLoginMutation } from '@/store/apiSlice'
import { setCredentials } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const loginFormSchema = yup.object({
  email: yup.string().email('Please enter valid email').required('Email is required'),

  password: yup.string().required('Password is required'),
})

type LoginFormFields = yup.InferType<typeof loginFormSchema>

const useSignIn = () => {
  const [loginUser, { isLoading }] = useLoginMutation()

  const dispatch = useAppDispatch()

  const router = useRouter()

  const { showNotification } = useNotificationContext()

  const { control, handleSubmit } = useForm<LoginFormFields>({
    resolver: yupResolver(loginFormSchema),

    defaultValues: {
      email: '',
      password: '',
    },
  })

  const login = handleSubmit(async (values: LoginFormFields) => {
    try {
      const result = await loginUser(values).unwrap()

      // setCredentials persists token + user (localStorage) and sets the cookie read by middleware.ts
      dispatch(setCredentials({ token: result.token, user: result.data }))

      showNotification({
        message: result.message || 'Login successful',
        variant: 'success',
      })

      // honour ?redirect=/some/page set by middleware (same-origin paths only)
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      router.replace(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard')
      router.refresh()
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || 'Login failed',
        variant: 'danger',
      })
    }
  })

  return {
    loading: isLoading,
    login,
    control,
  }
}

export default useSignIn
