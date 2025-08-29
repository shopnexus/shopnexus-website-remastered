import { Payment, ListPaymentsParams } from './payment.type'
import { useInfiniteQuery, useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getQueryClient } from '../query-client'
import { createPayment, deletePayment, getPayment, listPayments, patchPayment } from './payment.api'

const queryClient = getQueryClient()

export const useSuspenseGetPayment = (id: Payment['id']) => useSuspenseQuery({
  queryKey: ['payment', id],
  queryFn: () => getPayment(id),
})

export const useGetPayment = (id: Payment['id']) => useQuery({
  queryKey: ['payment', id],
  queryFn: () => getPayment(id),
  enabled: Boolean(id),
})

export const useListPayments = (params: ListPaymentsParams) => useInfiniteQuery({
  queryKey: ['payment', 'list', params],
  queryFn: ({ pageParam }) => listPayments(pageParam),
  getNextPageParam: (lastPageRes, _, lastPageParam) => {
    if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) {
      return undefined
    }

    return {
      ...lastPageParam,
      page: lastPageRes.pagination.next_page,
      cursor: lastPageRes.pagination.next_cursor,
      limit: lastPageParam.limit,
    }
  },
  initialPageParam: params,
})

export const useCreatePayment = () => useMutation({
  mutationFn: createPayment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['payment', 'list'] })
  },
})

export const usePatchPayment = () => useMutation({
  mutationFn: patchPayment,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['payment', data.id] })
  },
})

export const useDeletePayment = () => useMutation({
  mutationFn: deletePayment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['payment', 'list'] })
  },
})
