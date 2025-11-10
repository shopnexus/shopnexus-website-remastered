import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { Status } from "../common/status.type"
import { OrderItem } from "./order.customer"

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

export const useConfirmOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['order', 'confirm'],
    mutationFn: (params: {
      order_item_id: number
      from_address?: string | null
      specs: Record<string, string> // weight_grams, length_cm, width_cm, height_cm, ...
    }) =>
      customFetchStandard<{
        id: number
        account_id: number
        payment_option: string
        payment_status: string
        address: string
        date_created: string
        date_updated: string
        items: OrderItem[]
      }>(`order/confirm`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['order', 'list'] })
    },
  })
}


