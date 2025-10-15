import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

export type TOrder = {
  id: number
  account_id: number
  payment_gateway: string
  status: string
  address: string
  date_created: string
  date_updated: string
}

export type ListOrdersParams = PaginationParams<{
  account_id?: number
  status?: string
  date_from?: string
  date_to?: string
}>

export const useListOrders = (params: ListOrdersParams) =>
  useInfiniteQuery({
    queryKey: ['order', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TOrder>(`order?${QueryString.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<TOrder>, _, lastPageParam) => {
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

export const useGetOrder = (id?: number) =>
  useQuery({
    queryKey: ['order', 'detail', id],
    queryFn: () => customFetchStandard<TOrder>(`order/${id}`),
    enabled: typeof id === 'number' && id > 0,
  })

export type ConfirmOrderParams = {
  sku_id: number
  from_address?: string
  weight_grams: number
  length_cm: number
  width_cm: number
  height_cm: number
}

export const useConfirmOrder = () =>
  useMutation({
    mutationKey: ['order', 'confirm'],
    mutationFn: (params: ConfirmOrderParams) =>
      customFetchStandard<{ message: string }>(`order/confirm`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  })


