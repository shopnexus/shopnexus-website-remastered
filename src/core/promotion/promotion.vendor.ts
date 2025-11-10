import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

// ===== Types =====

export type Promotion = {
  id: number
  code: string
  ref_type: string
  ref_id?: number | null
  type: string
  title: string
  description?: string | null
  is_active: boolean
  date_started: string
  date_ended?: string | null
}

// ===== Hooks =====

export const useCreateDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      code: string
      ref_type: string
      ref_id?: number
      type: string
      title: string
      description?: string
      is_active: boolean
      date_started: string
      date_ended?: string
      order_wide: boolean
      min_spend: number
      max_discount: number
      discount_percent?: number
      discount_price?: number
    }) =>
      customFetchStandard<Promotion>(`catalog/promotion/discount`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['promotion'] })
    },
  })
}

export const useUpdateDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      id: number
      code?: string
      owner_id?: number
      ref_type?: string
      ref_id?: number
      title?: string
      description?: string
      is_active?: boolean
      date_started?: string
      date_ended?: string
      null_date_ended?: boolean
      order_wide?: boolean
      min_spend?: number
      max_discount?: number
      discount_percent?: number
      discount_price?: number
    }) =>
      customFetchStandard<Promotion>(`catalog/promotion/discount`, {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['promotion'] })
    },
  })
}

export const useListPromotionVendor = (params: PaginationParams<{
  is_active?: boolean
}>) =>
  useInfiniteQuery({
    queryKey: ['promotion', 'list', 'vendor', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<Promotion>(`catalog/promotion?${qs.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<Promotion>, _, lastPageParam) => {
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

export const useDeletePromotion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => customFetchStandard<{ message: string }>(`catalog/promotion/${id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['promotion'] })
    },
  })
}


