import { useMutation, useQuery } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/queryclient/query-client'
import { customFetchStandard } from '@/lib/queryclient/custom-fetch'

// ===== Types =====

export type AccountProfile = {
  id: string // UUID
  date_created: string
  date_updated: string
  type: 'Customer' | 'Vendor'
  status: string
  phone: string | null
  email: string | null
  username: string | null
  gender: string | null
  name: string | null
  date_of_birth: string | null // Can be null
  email_verified: boolean
  phone_verified: boolean
  default_contact_id: string | null // UUID, can be null
  avatar_url: string | null
  description: string | null
}

// ===== Hooks =====
export const useGetAccount = (accountId: string) =>
  useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => customFetchStandard<AccountProfile>(`account?account_id=${accountId}`),
    enabled: !!accountId,
  })

export const useGetMe = () =>
  useQuery({
    queryKey: ['account', 'me'],
    queryFn: async () => customFetchStandard<AccountProfile>('account/me'),
  })

export const useUpdateMe = () =>
  useMutation({
    mutationFn: async (params: {
      username?: string | null
      phone?: string | null
      email?: string | null
      gender?: 'Male' | 'Female' | 'Other'
      name?: string | null
      date_of_birth?: string | null
      avatar_rs_id?: string | null
      default_contact_id?: string | null // UUID
      description?: string | null
    }) =>
      customFetchStandard<AccountProfile>('account/me', {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await getQueryClient().invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })


