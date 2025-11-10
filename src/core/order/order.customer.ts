import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

export type OrderItem = {
  id: number
  order_id: number
  sku_id: number
  vendor_id: number
  confirmed_by_id: number | null
  shipment_id: number
  note: string
  status: string
  quantity: number
}

export type TOrder = {
  id: number
  account_id: number
  payment_option: string
  payment_status: string
  address: string
  date_created: string
  date_updated: string
  items: OrderItem[]
}

export const useQuote = () => useMutation({
  mutationKey: ['quote'],
  mutationFn: (params: {
    address: string
    skus: Array<{
      sku_id: number
      quantity: number
      promotion_ids?: number[]
      shipment_option: string
      note?: string
    }>
  }) => customFetchStandard<{
    total: number
    subtotal: number
    shipping: number
  }>(`order/quote`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),
})

export const useCheckout = () =>
  useMutation({
    mutationKey: ['checkout'],
    mutationFn: (params: {
      address: string
      payment_option: string
      buy_now: boolean
      skus: Array<{
        sku_id: number
        quantity: number
        promotion_ids?: number[]
        shipment_option: string
        note?: string
      }>
    }) => customFetchStandard<{
      order: TOrder
      url: string | null
    }>(`order/checkout`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })

export const useGetOrder = (id: number) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => customFetchStandard<TOrder>(`order/${id}`),
    enabled: !!id,
  })

export const useListOrders = (params: PaginationParams<{
  account_id?: number
  status?: string
  date_from?: string
  date_to?: string
}>) =>
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