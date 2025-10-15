import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

// Reuse the same shapes for vendor-side access
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

export const useListRefundsVendor = (params: ListRefundsParams) =>
  useInfiniteQuery({
    queryKey: ['order', 'refund', 'list', 'vendor', params],
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

export const useUpdateRefundVendor = () => {
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

export const useCancelRefundVendor = () => {
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

export const useConfirmRefundVendor = () => {
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


