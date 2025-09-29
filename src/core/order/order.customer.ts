import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import QueryString from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

type TOrder = {
  id: number
  account_id: number
  payment_gateway: string
  status: string
  address: string
  date_created: string
  date_updated: string
}

type CheckoutParams = {
  address: string
  payment_gateway: string
  sku_ids: number[]
}

type CheckoutResult = {
  order: TOrder
  url: string
}

export const useCheckout = () =>
  useMutation({
    mutationKey: ['checkout'],
    mutationFn: (params: CheckoutParams) => customFetchStandard<CheckoutResult>(`order/checkout`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })

type ListOrdersParams = PaginationParams<{
  account_id?: number
  status?: string
  date_from?: string
  date_to?: string
}>

export const useListOrders = (params: ListOrdersParams) =>
  useInfiniteQuery({
    queryKey: ['order', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<TOrder>(`catalog/order?${QueryString.stringify(pageParam, { arrayFormat: 'repeat' })}`),
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