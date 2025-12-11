import { useMutation, useQuery } from "@tanstack/react-query"
import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useInfiniteQueryPagination } from "@/lib/queryclient/use-infinite-query"
import { PaginationParams } from "@/lib/queryclient/response.type"

// ===== Types =====

export type OrderItem = {
  id: string
  order_id: string
  sku_id: string
  vendor_id: string
  confirmed_by_id: string | null
  shipment_id: string
  note: string
  status: string
  quantity: number
}

export type TOrder = {
  id: string
  account_id: string
  payment_option: string
  payment_status: string
  address: string
  date_created: string
  date_updated: string
  items: OrderItem[]
}

// ===== Hooks =====

export const useQuote = () => useMutation({
  mutationKey: ['quote'],
  mutationFn: (params: {
    address: string
    items: Array<{
      sku_id: string
      quantity: number
      promotion_codes?: string[]
      shipment_option: string
      note?: string
      data?: Record<string, any>
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
      items: Array<{
        sku_id: string
        quantity: number
        promotion_codes?: string[]
        shipment_option: string
        note?: string
        data?: Record<string, any>
      }>
    }) => customFetchStandard<{
      order: TOrder
      url: string | null
    }>(`order/checkout`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })

export const useGetOrder = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => customFetchStandard<TOrder>(`order/${id}`),
    enabled: !!id,
  })

export const useListOrders = (params: PaginationParams<{
  account_id?: string
  status?: string
  date_from?: string
  date_to?: string
}>) =>
  useInfiniteQueryPagination<TOrder>(
    ['order', 'list'],
    'order',
    params
  )

