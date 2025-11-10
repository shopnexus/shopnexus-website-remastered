import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { Status } from "../common/status.type"
import { Resource } from "../common/resource.type"

// ===== TYPES =====

export enum RefundMethod {
  PickUp = "PickUp",
  DropOff = "DropOff",
}



export type TRefund = {
  id: number
  account_id: number
  order_item_id: number
  reviewed_by_id: number | null
  shipment_id: number | null
  method: RefundMethod
  status: Status
  reason: string
  address: string | null
  date_created: string
  resources: Resource[]
}

// ===== REACT QUERY HOOKS =====

export const useCreateRefund = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      order_item_id: number
      method: string
      reason: string
      address: string | null
      resource_ids: string[]
    }) =>
      customFetchStandard<TRefund>(`order/refund`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}

export const useListRefunds = (params: PaginationParams<{
  status?: string
}>) =>
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
    mutationFn: (params: {
      id: number
      method?: string
      address?: string | null
      reason?: string
      resource_ids?: string[]
    }) =>
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
    mutationFn: (params: { id: number }) =>
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
    mutationFn: (params: { id: number }) =>
      customFetchStandard<TRefund>(`order/refund/confirm`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['order', 'refund'] })
    },
  })
}


