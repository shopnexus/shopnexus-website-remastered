import { useMutation, useQuery } from '@tanstack/react-query'
import { getQueryClient } from '../../lib/queryclient/query-client'
import { customFetchStandard } from '../../lib/queryclient/custom-fetch'

const queryClient = getQueryClient()

enum AccountType {
  Customer = "Customer",
  Vendor = "Vendor",
}

enum AccountStatus {
  Active = "Active",
  Suspended = "Suspended",
}

export type AccountBase = {
  code: string
  type: AccountType      // db.AccountType -> string enum likely
  status: AccountStatus    // db.AccountStatus -> string enum likely
  phone?: string | null
  email?: string | null
  username?: string | null
  date_created: number  // Unix timestamp (int64)
  date_updated: number  // Unix timestamp (int64)
}

export type LoginParams = {
  id: string
  password: string
}

export type LoginResult = {
  access_token: string
  refresh_token: string
}


export const useGetMe = () =>
  useQuery({
    queryKey: ['account', 'me'],
    queryFn: async () => customFetchStandard<AccountBase>('account/me'),
    enabled: !!globalThis?.localStorage?.getItem?.('token'),
  })

export const useLoginBasic = () =>
  useMutation({
    mutationFn: async (params: LoginParams) => customFetchStandard<LoginResult>('auth/login/basic', {
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

      await queryClient.setQueryData(['account', 'me'], null)
      return Promise.resolve()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })
