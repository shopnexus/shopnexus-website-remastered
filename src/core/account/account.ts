import { useMutation, useQuery } from '@tanstack/react-query'
import { getQueryClient } from '../../lib/queryclient/query-client'
import { customFetchStandard } from '../../lib/queryclient/custom-fetch'

const queryClient = getQueryClient()

// Types matching the contract
export type AccountProfile = {
  id: number
  date_created: string
  date_updated: string
  type: string
  status: string
  phone: string | null
  email: string | null
  username: string | null
  gender: string | null
  name: string | null
  date_of_birth: string
  email_verified: boolean
  phone_verified: boolean
  default_contact_id: number | null
  avatar_url: string | null
  description: string | null
}

export type AccountMe = AccountProfile

// Account queries
export const useGetAccount = (accountId: number) =>
  useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => customFetchStandard<AccountProfile>(`account?account_id=${accountId}`),
    enabled: !!accountId && !!globalThis?.localStorage?.getItem?.('token'),
  })

export const useGetMe = () =>
  useQuery({
    queryKey: ['account', 'me'],
    queryFn: async () => customFetchStandard<AccountMe>('account/me'),
    enabled: !!globalThis?.localStorage?.getItem?.('token'),
  })

export const useUpdateMe = () =>
  useMutation({
    mutationFn: async (params: {
      status?: string
      username?: string | null
      phone?: string | null
      email?: string | null
      gender?: string
      name?: string | null
      date_of_birth?: string | null
      avatar_rs_id?: string | null
      default_contact_id?: number | null
      description?: string | null
    }) =>
      customFetchStandard<AccountMe>('account/me', {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

// Auth mutations
export const useRegisterBasic = () =>
  useMutation({
    mutationFn: async (params: {
      type: 'Customer' | 'Vendor'
      username?: string | null
      email?: string | null
      phone?: string | null
      password: string
    }) => customFetchStandard<{
      access_token: string
      refresh_token: string
    }>('auth/register/basic', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    onSuccess: (data) => {
      // TODO: save to httpOnly cookie instead
      globalThis?.localStorage?.setItem?.('token', data.access_token)
      globalThis?.localStorage?.setItem?.('refresh_token', data.refresh_token)
    }
  })

export const useLoginBasic = () =>
  useMutation({
    mutationFn: async (params: {
      id: string
      password: string
    }) => customFetchStandard<{
      access_token: string
      refresh_token: string
    }>('auth/login/basic', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    onSuccess: (data) => {
      // TODO: save to httpOnly cookie instead
      globalThis?.localStorage?.setItem?.('token', data.access_token)
      globalThis?.localStorage?.setItem?.('refresh_token', data.refresh_token)
    }
  })

export const useSignOut = () =>
  useMutation({
    mutationFn: async () => {
      globalThis?.localStorage?.removeItem?.("token")
      globalThis?.localStorage?.removeItem?.("refresh_token")

      await queryClient.setQueryData(['account', 'me'], null)
      return Promise.resolve()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })
