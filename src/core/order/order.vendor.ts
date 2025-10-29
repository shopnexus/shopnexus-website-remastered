import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { Status } from "../shared/status.type"

export type TOrder = {
  id: number
  order_id: number
  sku_id: number
  vendor_id: number
  confirmed_by_id: number | null
  shipment_id: number
  note: string
  status: Status
  quantity: number
}

export const useListVendorOrders = (params: PaginationParams<unknown>) =>
  useInfiniteQuery({
    queryKey: ['order', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TOrder>(`order/vendor?${QueryString.stringify(pageParam, { arrayFormat: 'repeat' })}`),
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

export type ConfirmOrderParams = {
  order_item_id: number
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


