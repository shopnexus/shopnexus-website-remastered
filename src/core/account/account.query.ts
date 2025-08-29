import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getQueryClient } from '../query-client'
import {
  getUser,
  loginUser,
  patchAccount,
  patchUser,
  registerUser,
} from './account.api'

const queryClient = getQueryClient()

export const usePatchAccount = () =>
  useMutation({
    mutationFn: patchAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
    },
  })

// TODO: suspense queries are kindof dangerous in productio, because they failed to build if the query fails.
export const useSuspenseGetUser = () => useSuspenseQuery({
  queryKey: ['account', 'me'],
  queryFn: getUser,
})

export const useGetUser = () => useQuery({
  queryKey: ['account', 'me'],
  queryFn: getUser,
})

export const useLoginUser = () =>
  useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      globalThis?.localStorage?.setItem?.('token', data.token)
      queryClient.setQueryData(['account', 'me'], data.account)
    },
  })

export const useRegisterUser = () =>
  useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['account', 'me'], data.account)
    },
  })

export const usePatchUser = () =>
  useMutation({
    mutationFn: patchUser,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ['account', 'me'] })
      queryClient.setQueryData(['account', 'me'], data)
    },
  })
