import { useMutation, useQuery } from '@tanstack/react-query'
import { getQueryClient } from '../../lib/queryclient/query-client'
import { customFetchStandard } from '../../lib/queryclient/custom-fetch'

const queryClient = getQueryClient()

export type Contact = {
  id: number
  account_id: number
  full_name: string
  phone: string
  phone_verified: boolean
  address: string
  address_type: 'Home' | 'Work'
  date_created: string
  date_updated: string
}

export const useGetContact = (contactId: string | number) =>
  useQuery({
    queryKey: ['account', 'contact', contactId],
    queryFn: async () => customFetchStandard<Contact>(`account/contact/${contactId}`),
    enabled: !!contactId && !!globalThis?.localStorage?.getItem?.('token'),
  })

export const useListContacts = () =>
  useQuery({
    queryKey: ['account', 'contact'],
    queryFn: async () => customFetchStandard<Contact[]>('account/contact'),
    enabled: !!globalThis?.localStorage?.getItem?.('token'),
  })

export const useCreateContact = () =>
  useMutation({
    mutationFn: async (params: {
      full_name: string
      phone: string
      address: string
      address_type?: 'Home' | 'Work'
      phone_verified?: boolean
    }) =>
      customFetchStandard<Contact>('account/contact', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'contact'] })
    },
  })

export const useUpdateContact = () =>
  useMutation({
    mutationFn: async (params: {
      contact_id: number
      full_name?: string
      phone?: string
      address?: string
      address_type?: string
      phone_verified?: boolean
    }) =>
      customFetchStandard<Contact>('account/contact', {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'contact'] })
      await queryClient.invalidateQueries({ queryKey: ['account', 'contact', data.id] })
    },
  })

export const useDeleteContact = () =>
  useMutation({
    mutationFn: async (params: { contact_id: number }) =>
      customFetchStandard<{ message: string }>('account/contact', {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'contact'] })
    },
  })

