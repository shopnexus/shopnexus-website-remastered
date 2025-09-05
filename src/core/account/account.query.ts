import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getQueryClient } from '../query-client'
import {
  getMe,
  loginBasic,
  patchAccount,
} from './account.api'

const queryClient = getQueryClient()

export const usePatchAccount = () =>
  useMutation({
    mutationFn: patchAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

export const useGetMe = () =>
  useQuery({
    queryKey: ['account', 'me'],
    queryFn: getMe,
    enabled: !!globalThis?.localStorage?.getItem?.('token'),
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

// // TODO: suspense queries are kindof dangerous in productio, because they failed to build if the query fails.
// export const useSuspenseGetUser = () => useSuspenseQuery({
//   queryKey: ['account', 'me'],
//   queryFn: getUser,
// })

// export const useGetUser = () => useQuery({
//   queryKey: ['account', 'me'],
//   queryFn: getUser,
// })

export const useLoginBasic = () =>
  useMutation({
    mutationFn: loginBasic,
  })

// export const useRegisterUser = () =>
//   useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data) => {
//       queryClient.setQueryData(['account', 'me'], data.account)
//     },
//   })

// export const usePatchUser = () =>
//   useMutation({
//     mutationFn: patchUser,
//     onSuccess: (data) => {
//       // queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
//       queryClient.setQueryData(['account', 'me'], data)
//     },
//   })
