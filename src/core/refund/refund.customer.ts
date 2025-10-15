import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

// ===== TYPES =====

export type TRefund = {
  id: number
  order_id: number
  order_item_id: number
  method: string
  status: string
  reason: string
  address?: string | null
  date_created: string
  date_updated: string
}

export type CreateRefundParams = {
  order_item_id: number
  method: string
  reason: string
  address?: string
}

type RefundListFilters = {
  status?: string
}

export type ListRefundsParams = PaginationParams<RefundListFilters>

export type UpdateRefundParams = {
  id: number
  method?: string
  address?: string
  reason?: string
}

export type CancelRefundParams = { id: number }
export type ConfirmRefundParams = { id: number }

// ===== REACT QUERY HOOKS =====

export const useCreateRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateRefundParams) =>
      customFetchStandard<TRefund>(`order/refund`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}

export const useListRefunds = (params: ListRefundsParams) =>
  useInfiniteQuery({
    queryKey: ['order', 'refund', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TRefund>(`order/refund?${qs.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<TRefund>, _, lastPageParam) => {
      if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) return undefined
      return {
        ...lastPageParam,
        page: lastPageRes.pagination.next_page,
        cursor: lastPageRes.pagination.next_cursor,
        limit: lastPageParam.limit,
      }
    },
    initialPageParam: params,
  })

export const useUpdateRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateRefundParams) =>
      customFetchStandard<TRefund>(`order/refund`, {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}

export const useCancelRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CancelRefundParams) =>
      customFetchStandard<{ message: string }>(`order/refund`, {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}

export const useConfirmRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: ConfirmRefundParams) =>
      customFetchStandard<TRefund>(`order/refund/confirm`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}


